"""Tests for new AXIOM endpoints: /api/dsa/companies and /api/interviews."""
import os
import requests
import pytest

BASE_URL = os.environ.get("BASE_URL", "https://preview-deploy-151.preview.emergentagent.com")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --------- DSA Companies ---------
class TestDsaCompanies:
    def test_list_companies(self, client):
        r = client.get(f"{BASE_URL}/api/dsa/companies", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "companies" in data and "total" in data
        assert isinstance(data["companies"], list)
        # PRD says 26 companies; allow >=20 in case data drifted
        assert data["total"] >= 20, f"expected >=20 companies, got {data['total']}"
        # required fields
        c0 = data["companies"][0]
        for k in ("name", "slug", "segment", "tone", "initial", "count", "counts"):
            assert k in c0, f"missing {k} in {c0}"
        # featured companies present
        names = {c["name"] for c in data["companies"]}
        for must in ("Google", "Amazon", "Microsoft", "Meta"):
            assert must in names, f"{must} missing from companies list"

    def test_company_detail_google(self, client):
        r = client.get(f"{BASE_URL}/api/dsa/companies/google", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "company" in data and "problems" in data
        assert data["company"]["name"] == "Google"
        assert data["company"]["slug"] == "google"
        assert data["company"]["count"] >= 1
        assert isinstance(data["problems"], list)
        assert len(data["problems"]) == data["company"]["count"]
        # Each problem has required fields
        p0 = data["problems"][0]
        for k in ("id", "title", "difficulty"):
            assert k in p0

    def test_company_detail_404(self, client):
        r = client.get(f"{BASE_URL}/api/dsa/companies/nonexistent-xyz", timeout=15)
        assert r.status_code == 404, r.text
        data = r.json()
        assert "error" in data


# --------- Interview Experiences ---------
class TestInterviewExperiences:
    def test_list_default(self, client):
        r = client.get(f"{BASE_URL}/api/interviews", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "experiences" in data and "total" in data
        # Auto-seed: 15 entries on cold boot. After tests we may have more, so >=15
        assert data["total"] >= 15, f"expected >=15 experiences, got {data['total']}"
        e0 = data["experiences"][0]
        for k in ("id", "company", "role", "upvotes", "posted_at", "quote"):
            assert k in e0

    def test_sort_upvotes_desc(self, client):
        r = client.get(f"{BASE_URL}/api/interviews?sort=upvotes", timeout=15)
        assert r.status_code == 200
        exps = r.json()["experiences"]
        upvotes = [e["upvotes"] for e in exps]
        assert upvotes == sorted(upvotes, reverse=True), "Not sorted desc by upvotes"
        # Top should be Google with 375 per PRD seed
        if exps:
            assert exps[0]["company"] == "Google", f"Top company should be Google, got {exps[0]['company']}"
            assert exps[0]["upvotes"] == 375, f"Top upvotes should be 375, got {exps[0]['upvotes']}"

    def test_sort_recent(self, client):
        r = client.get(f"{BASE_URL}/api/interviews?sort=recent", timeout=15)
        assert r.status_code == 200
        exps = r.json()["experiences"]
        dates = [e["posted_at"] for e in exps]
        assert dates == sorted(dates, reverse=True), "Not sorted desc by posted_at"

    def test_filter_by_company_amazon(self, client):
        r = client.get(f"{BASE_URL}/api/interviews?company=Amazon", timeout=15)
        assert r.status_code == 200
        exps = r.json()["experiences"]
        assert len(exps) >= 1
        assert all(e["company"] == "Amazon" for e in exps), "Found non-Amazon entries"

    def test_filter_by_difficulty_hard(self, client):
        r = client.get(f"{BASE_URL}/api/interviews?difficulty=Hard", timeout=15)
        assert r.status_code == 200
        exps = r.json()["experiences"]
        assert all(e["difficulty"] == "Hard" for e in exps), "Found non-Hard entries"

    def test_companies_aggregate(self, client):
        r = client.get(f"{BASE_URL}/api/interviews/companies", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "companies" in data
        cmap = {c["company"]: c["count"] for c in data["companies"]}
        # Sanity
        assert cmap.get("Amazon", 0) >= 1
        assert cmap.get("Google", 0) >= 1
        assert cmap.get("Microsoft", 0) >= 1
        # Sorted desc
        counts = [c["count"] for c in data["companies"]]
        assert counts == sorted(counts, reverse=True)

    def test_post_missing_fields(self, client):
        r = client.post(f"{BASE_URL}/api/interviews", json={"company": "TestCo"}, timeout=15)
        assert r.status_code == 400, r.text
        assert "error" in r.json()

    def test_post_create_and_upvote(self, client):
        before = client.get(f"{BASE_URL}/api/interviews", timeout=15).json()["total"]
        payload = {
            "company": "TEST_AcmeCorp",
            "role": "SDE Intern",
            "rounds": 3,
            "problems": 4,
            "result": "Selected",
            "difficulty": "Medium",
            "location": "Remote",
            "experience_years": "0-1",
            "author_name": "TEST_User",
            "author_role": "Student",
            "quote": "TEST entry — please ignore. Verifies POST works end-to-end.",
        }
        r = client.post(f"{BASE_URL}/api/interviews", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        body = r.json()
        assert "experience" in body
        new_id = body["experience"]["id"]
        assert body["experience"]["company"] == "TEST_AcmeCorp"
        assert body["experience"]["author_name"] == "TEST_User"

        # Verify count increased
        after = client.get(f"{BASE_URL}/api/interviews", timeout=15).json()["total"]
        assert after == before + 1, f"expected {before + 1}, got {after}"

        # Upvote it
        before_up = body["experience"].get("upvotes", 0)
        u = client.post(f"{BASE_URL}/api/interviews/{new_id}/upvote", timeout=15)
        assert u.status_code == 200, u.text
        ud = u.json()
        assert ud["id"] == new_id
        assert ud["upvotes"] == before_up + 1

        # Upvote again to confirm increment
        u2 = client.post(f"{BASE_URL}/api/interviews/{new_id}/upvote", timeout=15)
        assert u2.status_code == 200
        assert u2.json()["upvotes"] == before_up + 2


# --------- Regression ---------
class TestRegression:
    def test_jobs_still_12(self, client):
        r = client.get(f"{BASE_URL}/api/jobs", timeout=15)
        assert r.status_code == 200
        assert r.json()["total"] == 12

    def test_posts_still_present(self, client):
        r = client.get(f"{BASE_URL}/api/posts", timeout=15)
        assert r.status_code == 200
        assert len(r.json()) >= 4
