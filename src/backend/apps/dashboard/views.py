from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.common.permissions import IsAdminUserRole, IsMemberOrAdmin
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer
from django.utils import timezone
from datetime import timedelta


class DashboardStatsView(APIView):
    permission_classes = (IsAuthenticated, IsMemberOrAdmin)

    def get(self, request):
        user = request.user
        thirty_days_ago = timezone.now() - timedelta(days=30)

        if user.role == "ADMIN" or user.is_superuser:
            total_users = User.objects.count()
            new_users = User.objects.filter(date_joined__gte=thirty_days_ago).count()
            admin_count = User.objects.filter(role="ADMIN").count()
            active_count = User.objects.filter(is_active=True).count()

            stats = {
                "role": "ADMIN",
                "total_users": total_users,
                "new_users_30d": new_users,
                "admin_accounts": admin_count,
                "active_accounts": active_count,
                "system_status": "Healthy",
                "uptime": "99.98%",
                "monthly_recurring_revenue": 14250,
                "active_subscriptions": total_users,
            }
        else:
            stats = {
                "role": "MEMBER",
                "api_calls_today": 128,
                "api_quota_limit": 5000,
                "active_projects": 3,
                "storage_used_mb": 420,
                "storage_quota_mb": 5000,
                "member_since": user.date_joined.strftime("%B %Y"),
                "status": "Active",
            }

        return Response(
            {
                "success": True,
                "data": stats,
                "message": "Dashboard statistics retrieved successfully.",
            },
            status=status.HTTP_200_OK,
        )


class AdminUserListView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUserRole)

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")
        serializer = UserSerializer(users, many=True)
        return Response(
            {
                "success": True,
                "data": {
                    "total": users.count(),
                    "users": serializer.data,
                },
                "message": "User registry retrieved.",
            },
            status=status.HTTP_200_OK,
        )


class AdminUserRoleUpdateView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUserRole)

    def patch(self, request, user_id):
        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "User not found.",
                        "details": {},
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        new_role = request.data.get("role")
        if new_role not in ["ADMIN", "MEMBER"]:
            return Response(
                {
                    "success": False,
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Invalid role specified. Must be ADMIN or MEMBER.",
                        "details": {},
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        target_user.role = new_role
        if "is_active" in request.data:
            target_user.is_active = bool(request.data["is_active"])
        target_user.save()

        return Response(
            {
                "success": True,
                "data": UserSerializer(target_user).data,
                "message": f"User role updated to {new_role}.",
            },
            status=status.HTTP_200_OK,
        )
