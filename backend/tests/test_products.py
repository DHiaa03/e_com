def test_list_products(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data

def test_filter_products_by_gender(client):
    response = client.get("/api/v1/products?gender_section=men")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["gender_section"] == "men"

def test_get_product_by_slug(client):
    response = client.get("/api/v1/products/test-tuxedo")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "test-tuxedo"
    assert "base_price" in data

def test_get_nonexistent_product(client):
    response = client.get("/api/v1/products/non-existent-product-12345")
    assert response.status_code == 404

def test_create_product_admin(client, admin_headers):
    payload = {
        "name_ar": "فستان سهرة كلاسيك",
        "name_en": "Classic Evening Dress",
        "slug": "classic-evening-dress-test",
        "base_price": "28000.00",
        "gender_section": "women",
        "category_id": 2
    }
    response = client.post("/api/v1/products", json=payload, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["slug"] == "classic-evening-dress-test"

def test_create_product_unauthorized(client):
    payload = {
        "name_ar": "فستان سهرة كلاسيك",
        "name_en": "Classic Evening Dress",
        "slug": "classic-evening-dress-unauth",
        "base_price": "28000.00",
        "gender_section": "women",
        "category_id": 2
    }
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 401
