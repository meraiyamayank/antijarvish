from django.contrib import admin
from .models import APIKey


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ("name", "prefix", "user", "is_active", "created_at", "last_used_at", "expires_at")
    list_filter = ("is_active", "created_at", "expires_at")
    search_fields = ("name", "prefix", "user__email")
    readonly_fields = ("prefix", "hashed_key", "created_at", "last_used_at")
