from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import APIKey
from .serializers import APIKeySerializer, APIKeyCreateSerializer


class APIKeyListCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        keys = APIKey.objects.filter(user=request.user)
        serializer = APIKeySerializer(keys, many=True)
        return Response(
            {
                "success": True,
                "data": serializer.data,
                "message": f"Retrieved {len(serializer.data)} API key(s).",
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = APIKeyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data["name"]
        scopes = serializer.validated_data.get("scopes", ["*"])
        expires_at = serializer.validated_data.get("expires_at")

        api_key, raw_key = APIKey.generate(
            user=request.user,
            name=name,
            scopes=scopes,
            expires_at=expires_at,
        )

        return Response(
            {
                "success": True,
                "data": {
                    "api_key": APIKeySerializer(api_key).data,
                    "secret_key": raw_key,
                },
                "message": "API key generated successfully. Store this key safely as it will not be displayed again.",
            },
            status=status.HTTP_201_CREATED,
        )


class APIKeyDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk, user):
        try:
            return APIKey.objects.get(pk=pk, user=user)
        except APIKey.DoesNotExist:
            return None

    def get(self, request, pk):
        api_key = self.get_object(pk, request.user)
        if not api_key:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "API Key not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = APIKeySerializer(api_key)
        return Response(
            {"success": True, "data": serializer.data, "message": "API key retrieved."},
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        api_key = self.get_object(pk, request.user)
        if not api_key:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "API Key not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = APIKeySerializer(api_key, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"success": True, "data": serializer.data, "message": "API key updated."},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):
        api_key = self.get_object(pk, request.user)
        if not api_key:
            return Response(
                {"success": False, "error": {"code": "NOT_FOUND", "message": "API Key not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        api_key.delete()
        return Response(
            {"success": True, "data": None, "message": "API key revoked and deleted."},
            status=status.HTTP_200_OK,
        )
