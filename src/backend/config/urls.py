from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class HealthCheckView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response(
            {
                "success": True,
                "data": {
                    "status": "healthy",
                    "system": "JARVIS Autonomous SaaS API",
                    "version": "1.0.0",
                },
                "message": "Service is operational.",
            }
        )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", HealthCheckView.as_view(), name="health-check"),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
    path("api/apikeys/", include("apps.apikeys.urls")),
]
