from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Report, ReportImage
from .serializer import ReportSerializer


class ApiRootView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response(
            {
                "message": "API de denuncias ambientales disponible.",
                "status": "ok",
                "endpoints": {
                    "reports": request.build_absolute_uri("/api/v1/reports/"),
                    "analytics": request.build_absolute_uri("/api/v1/reports/analytics/"),
                    "schema": request.build_absolute_uri("/api/schema/"),
                    "swagger": request.build_absolute_uri("/api/docs/swagger/"),
                    "redoc": request.build_absolute_uri("/api/docs/redoc/"),
                },
            },
            status=status.HTTP_200_OK,
        )


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.prefetch_related("images", "status_logs").all()

    def _attach_files(self, report, request):
        for file in request.FILES.getlist("uploaded_files"):
            ReportImage.objects.create(report=report, file=file)

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get("status")
        category_filter = self.request.query_params.get("category")
        anonymous_filter = self.request.query_params.get("is_anonymous")

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if category_filter:
            queryset = queryset.filter(category=category_filter)
        if anonymous_filter in {"true", "false"}:
            queryset = queryset.filter(is_anonymous=anonymous_filter == "true")
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data.pop("uploaded_files", None)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()
        self._attach_files(report, request)
        headers = self.get_success_headers(serializer.data)
        return Response(
            self.get_serializer(report).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        data.pop("uploaded_files", None)
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()
        self._attach_files(report, request)
        return Response(self.get_serializer(report).data)

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        reports = self.get_queryset()
        by_status = {
            status: reports.filter(status=status).count()
            for status, _ in Report.Status.choices
        }
        by_category = {
            category: reports.filter(category=category).count()
            for category, _ in Report.Category.choices
        }
        payload = {
            "total_reports": reports.count(),
            "anonymous_reports": reports.filter(is_anonymous=True).count(),
            "resolved_reports": reports.filter(status=Report.Status.RESOLVED).count(),
            "pending_reports": reports.filter(status=Report.Status.PENDING).count(),
            "by_status": by_status,
            "by_category": by_category,
            "recent_reports": ReportSerializer(reports[:5], many=True, context={"request": request}).data,
        }
        return Response(payload)
