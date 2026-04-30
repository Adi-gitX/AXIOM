"""
Iteration 3 regression tests
- Backend regressions: jobs (12), posts (>=4), companies, interviews list.
- FIX 1: CORS preflight + POST upvote from *.internal.preview.emergentagent.com origin.
- New routes: dsa/companies still available for UpcomingSheets layout tests.
"""
import pytest
import requests

BASE_URL = "http://localhost:8001"
INTERNAL_ORIGIN = "https://preview-deploy-151.internal.preview.emergentagent.com"
EXTERNAL_ORIGIN = "https://preview-deploy-151.preview.emergentagent.com"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Backend regression -----------------------------------------------------
class TestRegression:
    def test_jobs_count_is_12(self, client):
        r = client.get(f"{BASE_URL}/api/jobs")
        assert r.status_code == 200
        data = r.json()
        jobs = data.get("jobs", data) if isinstance(data, dict) else data
        assert isinstance(jobs, list)
        assert len(jobs) == 12

    def test_posts_at_least_4(self, client):
        r = client.get(f"{BASE_URL}/api/posts")
        assert r.status_code == 200
        data = r.json()
        posts = data.get("posts", data) if isinstance(data, dict) else data
        assert isinstance(posts, list)
        assert len(posts) >= 4

    def test_dsa_companies(self, client):
        r = client.get(f"{BASE_URL}/api/dsa/companies")
        assert r.status_code == 200
        body = r.json()
        assert isinstance(body.get("companies"), list)
        assert len(body["companies"]) > 0
        # Every company tile has the fields used by the UI
        for c in body["companies"][:5]:
            assert "slug" in c and "name" in c and "count" in c

    def test_interviews_list_has_three_demo_entries(self, client):
        r = client.get(f"{BASE_URL}/api/interviews")
        assert r.status_code == 200
        body = r.json()
        items = body.get("experiences") or body.get("items") or []
        assert isinstance(items, list)
        assert len(items) >= 3
        # Required fields used by InterviewExperiences cards
        first = items[0]
        for k in ("id", "company", "role", "upvotes", "quote"):
            assert k in first


# ---- FIX 1: CORS + upvote from internal preview origin ----------------------
class TestUpvoteCorsFix:
    def test_cors_preflight_internal_preview(self, client):
        r = client.options(
            f"{BASE_URL}/api/interviews/1/upvote",
            headers={
                "Origin": INTERNAL_ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        assert r.status_code == 204
        assert r.headers.get("Access-Control-Allow-Origin") == INTERNAL_ORIGIN
        assert "POST" in r.headers.get("Access-Control-Allow-Methods", "")

    def test_cors_preflight_external_preview(self, client):
        r = client.options(
            f"{BASE_URL}/api/interviews/1/upvote",
            headers={
                "Origin": EXTERNAL_ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        assert r.status_code == 204
        assert r.headers.get("Access-Control-Allow-Origin") == EXTERNAL_ORIGIN

    def test_post_upvote_increments(self, client):
        before = client.get(f"{BASE_URL}/api/interviews").json()
        b_items = before.get("experiences") or before.get("items") or []
        target = next(i for i in b_items if i.get("id") == 1)
        prev = target["upvotes"]

        r = client.post(
            f"{BASE_URL}/api/interviews/1/upvote",
            headers={"Origin": INTERNAL_ORIGIN},
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["id"] == 1
        assert isinstance(body["upvotes"], int)
        assert body["upvotes"] == prev + 1
        # CORS header echoed for non-preflight too
        assert r.headers.get("Access-Control-Allow-Origin") == INTERNAL_ORIGIN

    def test_cors_blocks_unknown_origin(self, client):
        # Sanity: random origin should NOT be echoed back
        r = client.options(
            f"{BASE_URL}/api/interviews/1/upvote",
            headers={
                "Origin": "https://evil.example.com",
                "Access-Control-Request-Method": "POST",
            },
        )
        # express cors throws -> 500 or no ACAO header. Either way, ACAO should not equal origin
        assert r.headers.get("Access-Control-Allow-Origin") != "https://evil.example.com"
