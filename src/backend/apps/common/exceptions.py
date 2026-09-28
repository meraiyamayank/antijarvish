from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """Custom DRF exception handler ensuring API format standards from 05-api.md."""
    response = exception_handler(exc, context)

    if response is not None:
        error_code = "API_ERROR"
        if response.status_code == 400:
            error_code = "VALIDATION_ERROR"
        elif response.status_code == 401:
            error_code = "AUTHENTICATION_FAILED"
        elif response.status_code == 403:
            error_code = "PERMISSION_DENIED"
        elif response.status_code == 404:
            error_code = "NOT_FOUND"

        detail = response.data
        message = "An error occurred."
        if isinstance(detail, dict):
            if "detail" in detail:
                message = str(detail["detail"])
            else:
                first_key = next(iter(detail))
                message = f"{first_key}: {detail[first_key]}"
        elif isinstance(detail, list) and detail:
            message = str(detail[0])

        response.data = {
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "details": response.data,
            },
        }

    return response
