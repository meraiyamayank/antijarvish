import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.authentication.models import User


@pytest.mark.django_db
def test_health_check():
    client = APIClient()
    response = client.get(reverse("health-check"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["status"] == "healthy"


@pytest.mark.django_db
def test_user_registration():
    client = APIClient()
    payload = {
        "email": "testuser@example.com",
        "password": "SecurePassword123!",
        "password_confirm": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "User",
    }
    response = client.post(reverse("auth-register"), payload)
    assert response.status_code == 201
    assert response.data["success"] is True
    assert response.data["data"]["email"] == "testuser@example.com"
    assert response.data["data"]["role"] == "MEMBER"
    assert User.objects.filter(email="testuser@example.com").exists()


@pytest.mark.django_db
def test_user_registration_password_mismatch():
    client = APIClient()
    payload = {
        "email": "mismatch@example.com",
        "password": "SecurePassword123!",
        "password_confirm": "DifferentPassword123!",
    }
    response = client.post(reverse("auth-register"), payload)
    assert response.status_code == 400
    assert response.data["success"] is False


@pytest.mark.django_db
def test_user_login_and_jwt_tokens():
    User.objects.create_user(
        email="loginuser@example.com",
        password="SecurePassword123!",
        first_name="Login",
        last_name="User",
    )
    client = APIClient()
    payload = {
        "email": "loginuser@example.com",
        "password": "SecurePassword123!",
    }
    response = client.post(reverse("auth-login"), payload)
    assert response.status_code == 200
    assert response.data["success"] is True
    assert "access" in response.data["data"]
    assert "refresh" in response.data["data"]
    assert response.data["data"]["user"]["email"] == "loginuser@example.com"

    # Test me endpoint with access token
    access_token = response.data["data"]["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    me_response = client.get(reverse("auth-me"))
    assert me_response.status_code == 200
    assert me_response.data["data"]["email"] == "loginuser@example.com"
