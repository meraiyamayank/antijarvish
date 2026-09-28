from rest_framework import serializers
from .models import APIKey


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = (
            "id",
            "name",
            "prefix",
            "scopes",
            "is_active",
            "created_at",
            "expires_at",
            "last_used_at",
        )
        read_only_fields = ("id", "prefix", "created_at", "last_used_at")


class APIKeyCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, required=True)
    scopes = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        default=list,
    )
    expires_at = serializers.DateTimeField(required=False, allow_null=True, default=None)
