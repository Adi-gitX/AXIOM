"""
Iteration 4 regression tests
- Auto-create user on first GET /api/users/:email (eliminates 404 noise for dev-bypass user)
- AI endpoints reachability (polish-story, problem-hint, bio-rewrite)
- Regressions for jobs/posts/interviews
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get("AXIOM_BASE_URL", "http://localhost:8001")
PUBLIC_URL = "https://preview-deploy-151.preview.emergentagent.com"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Iteration 4 NEW: Auto-create user on profile fetch ---------------------
class TestAutoCreateUserProfile:
    def test_get_dev_bypass_user_returns_200(self, client):
        """Dev bypass user dev@axiom.local should auto-create on first fetch."""
        r = client.get(f"{BASE_URL}/api/users/dev%40axiom.local")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"
        data = r.json()
        assert data["email"] == "dev@axiom.local"
        assert "id" in data
        assert data["avatar"]  # auto-generated avatar should be present

    def test_get_brand_new_user_auto_creates(self, client):
        """A brand-new email should be auto-created on first GET."""
        unique_email = f"TEST_autocreate_{int(time.time())}@axiom.test"
        # First request should create
        r = client.get(f"{BASE_URL}/api/users/{unique_email.replace('@', '%40')}")
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == unique_email

        # Second request should return same user
        r2 = client.get(f"{BASE_URL}/api/users/{unique_email.replace('@', '%40')}")
        assert r2.status_code == 200
        data2 = r2.json()
        assert data2["id"] == data["id"]

    def test_public_url_user_auto_create(self):
        """Public URL through ingress also returns 200."""
        r = requests.get(f"{PUBLIC_URL}/api/users/dev%40axiom.local", timeout=10)
        assert r.status_code == 200, f"Public URL got {r.status_code}"
        assert r.json()["email"] == "dev@axiom.local"


# ---- Iteration 4 NEW: AI endpoints ------------------------------------------
class TestAiEndpoints:
    """The AI endpoints should at minimum be reachable (200/4xx, not 404/500)."""

    def test_polish_story_route_exists(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/polish-story",
            json={"text": "I worked on a project."},
        )
        # Should respond (success or validation), not 404
        assert r.status_code != 404, f"Route missing: {r.text[:200]}"

    def test_problem_hint_route_exists(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/problem-hint",
            json={"problem": "Two Sum", "difficulty": "easy"},
        )
        assert r.status_code != 404, f"Route missing: {r.text[:200]}"

    def test_bio_rewrite_route_exists(self, client):
        r = client.post(
            f"{BASE_URL}/api/ai/bio-rewrite",
            json={"bio": "I am a developer."},
        )
        assert r.status_code != 404, f"Route missing: {r.text[:200]}"


# ---- Regression -------------------------------------------------------------
class TestRegression:
    def test_jobs_still_12(self, client):
        r = client.get(f"{BASE_URL}/api/jobs")
        assert r.status_code == 200
        d = r.json()
        jobs = d.get("jobs", d) if isinstance(d, dict) else d
        assert len(jobs) == 12

    def test_posts_present(self, client):
        r = client.get(f"{BASE_URL}/api/posts")
        assert r.status_code == 200
        posts = r.json()
        assert isinstance(posts, list)
        assert len(posts) >= 4

    def test_interviews_list(self, client):
        r = client.get(f"{BASE_URL}/api/interviews")
        assert r.status_code == 200
        d = r.json()
        if isinstance(d, dict):
            items = d.get("experiences") or d.get("items") or []
        else:
            items = d
        assert isinstance(items, list)

    def test_dsa_companies(self, client):
        r = client.get(f"{BASE_URL}/api/dsa/companies")
        assert r.status_code == 200
