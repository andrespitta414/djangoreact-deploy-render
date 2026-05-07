from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APIClient

from .models import Report


class ReportModelTests(TestCase):
    def test_identifier_and_status_log_are_generated(self):
        report = Report.objects.create(
            category=Report.Category.WATER,
            what_happened="Se detecta vertimiento de residuos en una quebrada.",
            when_happened="2026-04-22 08:30",
            details="Liquido oscuro visible en el cauce.",
        )

        self.assertEqual(report.identifier, "2026-001")
        self.assertEqual(report.status_logs.count(), 1)
        self.assertEqual(report.status_logs.first().status, Report.Status.PENDING)


class ReportApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root_returns_service_index(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertIn("reports", response.data["endpoints"])

    def test_other_category_requires_description(self):
        payload = {
            "title": "Caso con categoria libre",
            "category": "other",
            "what_happened": "Se detecta una afectacion ambiental no categorizada.",
            "when_happened": "22 de abril de 2026",
            "details": "Detalle adicional",
            "status": "pending",
            "is_anonymous": True,
        }

        response = self.client.post("/api/v1/reports/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("other_category", response.data)

    def test_create_attaches_all_uploaded_files(self):
        payload = {
            "title": "Caso con evidencia",
            "category": Report.Category.WASTE,
            "what_happened": "Se reportan residuos en un humedal.",
            "when_happened": "5 de mayo de 2026",
            "details": "Se adjuntan dos fotos del mismo punto.",
            "uploaded_files": [
                SimpleUploadedFile("evidencia-1.jpg", b"file-content-1", content_type="image/jpeg"),
                SimpleUploadedFile("evidencia-2.jpg", b"file-content-2", content_type="image/jpeg"),
            ],
        }

        response = self.client.post("/api/v1/reports/", payload, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report = Report.objects.get(pk=response.data["id"])
        self.assertEqual(report.images.count(), 2)
