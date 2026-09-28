import hashlib
import secrets
from django.conf import settings
from django.db import models
from django.utils import timezone


class APIKey(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="api_keys",
    )
    name = models.CharField(max_length=120, help_text="Friendly label for the API key")
    prefix = models.CharField(max_length=16, db_index=True, help_text="Key prefix for quick identification")
    hashed_key = models.CharField(max_length=128, unique=True, db_index=True)
    scopes = models.JSONField(default=list, blank=True, help_text="List of granted scope strings")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "api_keys"
        ordering = ["-created_at"]
        verbose_name = "API Key"
        verbose_name_plural = "API Keys"

    def __str__(self):
        return f"{self.name} ({self.prefix}...)"

    @classmethod
    def generate(cls, user, name: str, scopes: list = None, expires_at=None):
        """Generate a cryptographically secure API key, store its hash, and return (instance, raw_key)."""
        scopes = scopes or ["*"]
        raw_secret = secrets.token_urlsafe(32)
        raw_key = f"jrv_live_{raw_secret}"
        prefix = raw_key[:14]
        hashed_key = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

        instance = cls.objects.create(
            user=user,
            name=name,
            prefix=prefix,
            hashed_key=hashed_key,
            scopes=scopes,
            expires_at=expires_at,
        )
        return instance, raw_key

    def verify(self, raw_key: str) -> bool:
        """Verify the raw key against the stored SHA-256 hash."""
        candidate_hash = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        return secrets.compare_digest(candidate_hash, self.hashed_key)

    @property
    def is_expired(self) -> bool:
        if self.expires_at and timezone.now() >= self.expires_at:
            return True
        return False
