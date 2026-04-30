"""Backend smoke + integration tests for AXIOM (Express server on :8001)."""
import os
import requests
import pytest

BASE_URL = "https://preview-deploy-151.preview.emergentagent.com"
# /health has no /api prefix so ingress routes it to frontend; test it directly.
BACKEND_DIRECT = os.environ.get("BACKEND_DIRECT", "http://localhost:8001")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Health -----
class TestHealth:
    def test_health(self, client):
        r = client.get(f"{BACKEND_DIRECT}/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "healthy", data


# ----- Jobs -----
class TestJobs:
    EXPECTED_COMPANIES = {"Google", "Meta", "Stripe", "Airbnb", "Netflix", "Spotify",
                          "Shopify", "Uber", "Dropbox", "Microsoft", "Amazon", "Apple"}

    def test_jobs_list_shape(self, client):
        r = client.get(f"{BASE_URL}/api/jobs", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "jobs" in data and "total" in data
        assert isinstance(data["jobs"], list)
        assert data["total"] >= 12

    def test_jobs_contains_seeded_companies(self, client):
        r = client.get(f"{BASE_URL}/api/jobs", timeout=15)
        companies = {j["company"] for j in r.json().get("jobs", [])}
        missing = self.EXPECTED_COMPANIES - companies
        assert not missing, f"Missing seeded companies: {missing}"

    def test_jobs_idempotent_total_stays_12(self, client):
        # auto-seed must NOT duplicate on each call
        r1 = client.get(f"{BASE_URL}/api/jobs", timeout=15).json()
        r2 = client.get(f"{BASE_URL}/api/jobs", timeout=15).json()
        assert r1["total"] == r2["total"] == 12, (r1["total"], r2["total"])


# ----- Posts -----
class TestPosts:
    def test_posts_list(self, client):
        r = client.get(f"{BASE_URL}/api/posts", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4, f"expected >=4 posts, got {len(data)}"

    def test_posts_have_required_fields(self, client):
        r = client.get(f"{BASE_URL}/api/posts", timeout=15)
        for p in r.json()[:3]:
            for k in ("id", "title", "source_name", "author_name"):
                assert k in p, f"missing {k} in {p}"


# ----- Other backend endpoints quick smoke -----
class TestOtherEndpoints:
    @pytest.mark.parametrize("path", [
        "/api/oss/projects",
        "/api/gsoc/orgs",
        "/api/education/courses",
        "/api/interview/questions",
    ])
    def test_optional_endpoint_responds(self, client, path):
        r = client.get(f"{BASE_URL}{path}", timeout=15)
        # must be reachable; allow 200 or 404 (route may not exist) but never 500
        assert r.status_code < 500, f"{path} -> {r.status_code} {r.text[:200]}"
