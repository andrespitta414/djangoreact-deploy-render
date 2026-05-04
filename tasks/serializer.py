from rest_framework import serializers

from .models import Report, ReportImage, ReportStatusLog


class ReportImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportImage
        fields = ("id", "file", "uploaded_at")
        read_only_fields = ("id", "uploaded_at")


class ReportStatusLogSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = ReportStatusLog
        fields = ("id", "status", "status_label", "note", "created_at")
        read_only_fields = fields


class ReportSerializer(serializers.ModelSerializer):
    images = ReportImageSerializer(many=True, read_only=True)
    status_logs = ReportStatusLogSerializer(many=True, read_only=True)
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
    )
    category_label = serializers.CharField(source="get_category_display", read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Report
        fields = (
            "id",
            "identifier",
            "title",
            "description",
            "done",
            "category",
            "category_label",
            "other_category",
            "what_happened",
            "when_happened",
            "details",
            "latitude",
            "longitude",
            "status",
            "status_label",
            "is_anonymous",
            "created_at",
            "updated_at",
            "images",
            "status_logs",
            "uploaded_files",
        )
        read_only_fields = (
            "id",
            "identifier",
            "done",
            "created_at",
            "updated_at",
            "images",
            "status_logs",
            "category_label",
            "status_label",
        )

    def validate(self, attrs):
        category = attrs.get("category", getattr(self.instance, "category", None))
        other_category = attrs.get("other_category", getattr(self.instance, "other_category", ""))
        if category == Report.Category.OTHER and not other_category.strip():
            raise serializers.ValidationError(
                {"other_category": "Debes especificar la categoria cuando eliges 'Otro'."}
            )
        return attrs

    def create(self, validated_data):
        uploaded_files = validated_data.pop("uploaded_files", [])
        report = super().create(validated_data)
        self._attach_files(report, uploaded_files)
        return report

    def update(self, instance, validated_data):
        uploaded_files = validated_data.pop("uploaded_files", [])
        report = super().update(instance, validated_data)
        self._attach_files(report, uploaded_files)
        return report

    def _attach_files(self, report, uploaded_files):
        for file in uploaded_files:
            ReportImage.objects.create(report=report, file=file)
