from django.test import TestCase
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
