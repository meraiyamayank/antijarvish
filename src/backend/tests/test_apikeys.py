from datetime import timedelta
import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from apps.authentication.models import User
from apps.apikeys.models import APIKey


@pytest.fixture
def test_user(db):
    return User.objects.create_user(
        email="keyowner@example.com",
        password="SecurePassword123!",
        first_name="Key",
        last_name="Owner",
    )


@pytest.fixture
def other_user(db):
    return User.objects.create_user(
        email="otheruser@example.com",
        password="SecurePassword123!",
        first_name="Other",
        last_name="User",
    )


@pytest.mark.django_db
def test_create_api_key(test_user):
    client = APIClient()
    client.force_authenticate(user=test_user)

    payload = {
        "name": "Production Service Key",
        "scopes": ["read", "write"],
    }
    response = client.post(reverse("apikeys:apikey-list-create"), payload, format="json")
    assert response.status_code == 201
    assert response.data["success"] is True
    assert "secret_key" in response.data["data"]
    assert response.data["data"]["secret_key"].startswith("jrv_live_")
    assert response.data["data"]["api_key"]["name"] == "Production Service Key"
    assert response.data["data"]["api_key"]["is_active"] is True
    assert APIKey.objects.filter(user=test_user, name="Production Service Key").exists()


@pytest.mark.django_db
def test_list_api_keys_masks_secret(test_user):
    api_key, raw_key = APIKey.generate(user=test_user, name="My Automated Key")

    client = APIClient()
    client.force_authenticate(user=test_user)

    response = client.get(reverse("apikeys:apikey-list-create"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert len(response.data["data"]) == 1
    item = response.data["data"][0]
    assert item["name"] == "My Automated Key"
    assert item["prefix"] == raw_key[:14]
    # Secret must never be leaked on listing
    assert "secret_key" not in item
    assert "hashed_key" not in item


@pytest.mark.django_db
def test_user_isolation(test_user, other_user):
    key_test, _ = APIKey.generate(user=test_user, name="User A Key")
    key_other, _ = APIKey.generate(user=other_user, name="User B Key")

    client = APIClient()
    client.force_authenticate(user=test_user)

    # Test user A cannot see user B's key
    list_response = client.get(reverse("apikeys:apikey-list-create"))
    assert len(list_response.data["data"]) == 1
    assert list_response.data["data"][0]["name"] == "User A Key"

    # Test user A cannot retrieve user B's key directly
    detail_response = client.get(reverse("apikeys:apikey-detail", kwargs={"pk": key_other.pk}))
    assert detail_response.status_code == 404

    # Test user A cannot delete user B's key
    delete_response = client.delete(reverse("apikeys:apikey-detail", kwargs={"pk": key_other.pk}))
    assert delete_response.status_code == 404
    assert APIKey.objects.filter(pk=key_other.pk).exists()


@pytest.mark.django_db
def test_authenticate_with_x_api_key_header(test_user):
    api_key, raw_key = APIKey.generate(user=test_user, name="CLI Key")

    client = APIClient()
    client.credentials(HTTP_X_API_KEY=raw_key)

    # Call a protected endpoint using the API key
    response = client.get(reverse("auth-me"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["email"] == "keyowner@example.com"

    # Verify last_used_at was updated
    api_key.refresh_from_db()
    assert api_key.last_used_at is not None


@pytest.mark.django_db
def test_authenticate_with_authorization_api_key_header(test_user):
    api_key, raw_key = APIKey.generate(user=test_user, name="Webhook Key")

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Api-Key {raw_key}")

    response = client.get(reverse("auth-me"))
    assert response.status_code == 200
    assert response.data["data"]["email"] == "keyowner@example.com"


@pytest.mark.django_db
def test_rejected_with_invalid_api_key():
    client = APIClient()
    client.credentials(HTTP_X_API_KEY="jrv_live_invalid_key_xyz123")

    response = client.get(reverse("auth-me"))
    assert response.status_code == 401
    assert response.data["success"] is False


@pytest.mark.django_db
def test_rejected_with_revoked_api_key(test_user):
    api_key, raw_key = APIKey.generate(user=test_user, name="Revoked Key")
    api_key.is_active = False
    api_key.save()

    client = APIClient()
    client.credentials(HTTP_X_API_KEY=raw_key)

    response = client.get(reverse("auth-me"))
    assert response.status_code == 401
    assert response.data["success"] is False


@pytest.mark.django_db
def test_rejected_with_expired_api_key(test_user):
    past_time = timezone.now() - timedelta(days=1)
    api_key, raw_key = APIKey.generate(
        user=test_user, name="Expired Key", expires_at=past_time
    )

    client = APIClient()
    client.credentials(HTTP_X_API_KEY=raw_key)

    response = client.get(reverse("auth-me"))
    assert response.status_code == 401
    assert response.data["success"] is False


@pytest.mark.django_db
def test_revoke_api_key(test_user):
    api_key, _ = APIKey.generate(user=test_user, name="Key to Delete")

    client = APIClient()
    client.force_authenticate(user=test_user)

    response = client.delete(reverse("apikeys:apikey-detail", kwargs={"pk": api_key.pk}))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert not APIKey.objects.filter(pk=api_key.pk).exists()


@pytest.mark.django_db
def test_patch_api_key(test_user):
    api_key, _ = APIKey.generate(user=test_user, name="Old Name")

    client = APIClient()
    client.force_authenticate(user=test_user)

    response = client.patch(
        reverse("apikeys:apikey-detail", kwargs={"pk": api_key.pk}),
        {"name": "New Name", "is_active": False},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["data"]["name"] == "New Name"
    assert response.data["data"]["is_active"] is False

    api_key.refresh_from_db()
    assert api_key.name == "New Name"
    assert api_key.is_active is False
