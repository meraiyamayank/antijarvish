from django.urls import path
from .views import APIKeyListCreateView, APIKeyDetailView

app_name = "apikeys"

urlpatterns = [
    path("", APIKeyListCreateView.as_view(), name="apikey-list-create"),
    path("<int:pk>/", APIKeyDetailView.as_view(), name="apikey-detail"),
]
