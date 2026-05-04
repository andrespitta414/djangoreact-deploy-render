from django.db import models
from django.utils import timezone


class Report(models.Model):
    class Category(models.TextChoices):
        AIR = "air_pollution", "Contaminacion del aire"
        WATER = "water_pollution", "Contaminacion del agua"
        WASTE = "waste_dumping", "Vertimiento de residuos"
        DEFORESTATION = "deforestation", "Deforestacion"
        WILDLIFE = "wildlife_trafficking", "Afectacion de fauna"
        NOISE = "noise_pollution", "Contaminacion auditiva"
        OTHER = "other", "Otro"

    class Status(models.TextChoices):
        PENDING = "pending", "Pendiente"
        IN_REVIEW = "in_review", "En revision"
        RESOLVED = "resolved", "Resuelto"
        REJECTED = "rejected", "Rechazado"

    identifier = models.SlugField(max_length=16, unique=True, blank=True)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    category = models.CharField(
        max_length=32,
        choices=Category.choices,
        default=Category.WASTE,
    )
    other_category = models.CharField(max_length=120, blank=True)
    what_happened = models.TextField()
    when_happened = models.TextField()
    details = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(
        max_length=24,
        choices=Status.choices,
        default=Status.PENDING,
    )
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.identifier or self.title or f"Report #{self.pk}"

    def clean(self):
        if self.category == self.Category.OTHER and not self.other_category.strip():
            from django.core.exceptions import ValidationError

            raise ValidationError({"other_category": "This field is required when category is 'Otro'."})

    def _build_identifier(self):
        year = (self.created_at or timezone.now()).year
        prefix = f"{year}-"
        last_report = (
            Report.objects.filter(identifier__startswith=prefix)
            .order_by("-identifier")
            .first()
        )
        last_sequence = 0
        if last_report and last_report.identifier:
            try:
                last_sequence = int(last_report.identifier.split("-")[-1])
            except (ValueError, IndexError):
                last_sequence = 0
        return f"{year}-{last_sequence + 1:03d}"

    def save(self, *args, **kwargs):
        if not self.identifier:
            self.identifier = self._build_identifier()
        if not self.title:
            self.title = self.get_category_display()
        if not self.description:
            self.description = self.what_happened
        self.done = self.status == self.Status.RESOLVED
        is_new = self._state.adding
        previous_status = None
        if not is_new and self.pk:
            previous_status = (
                Report.objects.filter(pk=self.pk).values_list("status", flat=True).first()
            )
        super().save(*args, **kwargs)
        if is_new:
            ReportStatusLog.objects.create(
                report=self,
                status=self.status,
                note="Denuncia registrada en la plataforma.",
            )
        elif previous_status != self.status:
            ReportStatusLog.objects.create(
                report=self,
                status=self.status,
                note=f"Estado actualizado a {self.get_status_display()}.",
            )


class ReportImage(models.Model):
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name="images",
    )
    file = models.FileField(upload_to="reports/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]

    def __str__(self):
        return f"{self.report.identifier} - {self.file.name}"


class ReportStatusLog(models.Model):
    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name="status_logs",
    )
    status = models.CharField(max_length=24, choices=Report.Status.choices)
    note = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.report.identifier} - {self.status}"
