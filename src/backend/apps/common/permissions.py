from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """Allows access only to users with the ADMIN role or superusers."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                getattr(request.user, "role", None) == "ADMIN"
                or request.user.is_superuser
            )
        )


class IsMemberOrAdmin(BasePermission):
    """Allows access to authenticated users who have either MEMBER or ADMIN roles."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ["ADMIN", "MEMBER"]
        )
