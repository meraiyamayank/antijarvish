import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.authentication.models import User


@pytest.fixture
def member_user():
    return User.objects.create_user(
        email="member@example.com",
        password="Password123!",
        role="MEMBER",
        first_name="Member",
        last_name="One",
    )


@pytest.fixture
def admin_user():
    return User.objects.create_superuser(
        email="admin@example.com",
        password="AdminPassword123!",
        role="ADMIN",
        first_name="System",
        last_name="Admin",
    )


@pytest.mark.django_db
def test_member_dashboard_stats(member_user):
    client = APIClient()
    client.force_authenticate(user=member_user)
    response = client.get(reverse("dashboard-stats"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["role"] == "MEMBER"
    assert "api_calls_today" in response.data["data"]


@pytest.mark.django_db
def test_admin_dashboard_stats(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)
    response = client.get(reverse("dashboard-stats"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["role"] == "ADMIN"
    assert "total_users" in response.data["data"]


@pytest.mark.django_db
def test_rbac_member_cannot_access_admin_user_list(member_user):
    client = APIClient()
    client.force_authenticate(user=member_user)
    response = client.get(reverse("admin-user-list"))
    assert response.status_code == 403
    assert response.data["success"] is False


@pytest.mark.django_db
def test_rbac_admin_can_access_and_update_roles(admin_user, member_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)

    # List users
    response = client.get(reverse("admin-user-list"))
    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["total"] >= 2

    # Promote member to ADMIN
    update_url = reverse("admin-user-role-update", kwargs={"user_id": member_user.id})
    update_response = client.patch(update_url, {"role": "ADMIN"}, format="json")
    assert update_response.status_code == 200
    assert update_response.data["success"] is True
    member_user.refresh_from_db()
    assert member_user.role == "ADMIN"
