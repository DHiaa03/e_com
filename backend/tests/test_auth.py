def test_admin_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.com", "password": "TestAdminPass123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_admin_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@test.com", "password": "WrongPassword"}
    )
    assert response.status_code == 401
    assert "detail" in response.json()

def test_admin_me_authorized(client, admin_headers):
    response = client.get("/api/v1/auth/me", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"

def test_admin_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
