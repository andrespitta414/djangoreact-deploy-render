from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse


DIST_DIR = Path(settings.BASE_DIR) / "dist"


def serve_frontend(request, *args, **kwargs):
    index_path = DIST_DIR / "index.html"
    if not index_path.exists():
        raise Http404("Frontend build not found. Run npm.cmd run build first.")
    return HttpResponse(index_path.read_text(encoding="utf-8"), content_type="text/html")


def serve_frontend_asset(request, path):
    asset_path = (DIST_DIR / "assets" / path).resolve()
    assets_dir = (DIST_DIR / "assets").resolve()

    if assets_dir not in asset_path.parents or not asset_path.is_file():
        raise Http404("Frontend asset not found.")

    return FileResponse(asset_path.open("rb"))
