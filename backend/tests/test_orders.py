def test_create_guest_order_success(client):
    order_payload = {
        "customer_name": "كريم التلمساني",
        "phone": "0555123456",
        "email": "karim@test.com",
        "address": "شارع ديدوش مراد رقم 15",
        "city": "الجزائر العاصمة",
        "notes": "الاتصال قبل الوصول",
        "items": [
            {
                "product_id": 1,
                "quantity": 2
            }
        ]
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 201
    data = response.json()
    assert "order_number" in data
    assert data["order_number"].startswith("BE-")
    assert data["payment_method"] == "cash_on_delivery"
    assert data["status"] == "pending"
    assert float(data["total_amount"]) > 0
    assert len(data["items"]) == 1

def test_create_guest_order_empty_items(client):
    order_payload = {
        "customer_name": "كريم التلمساني",
        "phone": "0555123456",
        "address": "الجزائر",
        "items": []
    }
    response = client.post("/api/v1/orders", json=order_payload)
    assert response.status_code == 400

def test_admin_orders_stats(client, admin_headers):
    response = client.get("/api/v1/orders/stats/summary", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "pending_orders" in data

def test_admin_orders_stats_unauthorized(client):
    response = client.get("/api/v1/orders/stats/summary")
    assert response.status_code == 401

def test_update_order_status(client, admin_headers):
    # Update order id 1
    response = client.patch(
        "/api/v1/orders/1/status",
        json={"status": "confirmed"},
        headers=admin_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"
