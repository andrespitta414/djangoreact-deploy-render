from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django_crud_api.frontend import serve_frontend, serve_frontend_asset
from tasks.views import ApiRootView


urlpatterns = [
    path("", ApiRootView.as_view(), name="api-root"),
    re_path(
        r"^(new-report|tracking|dashboard|citizen/new-report|citizen/tracking|admin/(dashboard|reports|heatmaps|analytics|users))/?$",
        serve_frontend,
        name="frontend",
    ),
    path("admin/", admin.site.urls),
    path("", include("tasks.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("assets/<path:path>", serve_frontend_asset, name="frontend-assets"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
