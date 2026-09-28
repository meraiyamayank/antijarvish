from django.urls import path
from .views import (
    DashboardStatsView,
    AdminUserListView,
    AdminUserRoleUpdateView,
)

urlpatterns = [
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:user_id>/", AdminUserRoleUpdateView.as_view(), name="admin-user-role-update"),
]
