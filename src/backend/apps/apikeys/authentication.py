import hashlib
from django.utils import timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import APIKey


class APIKeyAuthentication(BaseAuthentication):
    """
    Authenticate requests using an API Key provided in:
      - 'X-API-Key: jrv_live_...'
      - 'Authorization: Api-Key jrv_live_...'
    """

    header_name = "HTTP_X_API_KEY"

    def authenticate(self, request):
        raw_key = None

        # Check X-API-Key header
        if self.header_name in request.META:
            raw_key = request.META[self.header_name].strip()

        # Fallback to Authorization: Api-Key <token>
        if not raw_key and "HTTP_AUTHORIZATION" in request.META:
            auth_header = request.META["HTTP_AUTHORIZATION"]
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() in ("api-key", "apikey"):
                raw_key = parts[1].strip()

        if not raw_key:
            return None  # No API key supplied; allow subsequent authenticators (e.g. JWT)

        hashed_key = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

        try:
            api_key = APIKey.objects.select_related("user").get(hashed_key=hashed_key)
        except APIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API key.")

        if not api_key.is_active:
            raise AuthenticationFailed("This API key has been revoked.")

        if api_key.is_expired:
            raise AuthenticationFailed("This API key has expired.")

        if not api_key.user.is_active:
            raise AuthenticationFailed("The user account associated with this key is inactive.")

        # Update last_used_at timestamp without triggering signals
        APIKey.objects.filter(pk=api_key.pk).update(last_used_at=timezone.now())

        return (api_key.user, api_key)
