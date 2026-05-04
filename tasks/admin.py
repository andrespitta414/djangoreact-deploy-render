from django.contrib import admin

from .models import Report, ReportImage, ReportStatusLog


class ReportImageInline(admin.TabularInline):
    model = ReportImage
    extra = 0


class ReportStatusLogInline(admin.TabularInline):
    model = ReportStatusLog
    extra = 0
    readonly_fields = ("status", "note", "created_at")


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("identifier", "category", "status", "is_anonymous", "created_at")
    list_filter = ("category", "status", "is_anonymous")
    search_fields = ("identifier", "title", "what_happened", "details", "other_category")
    readonly_fields = ("identifier", "created_at", "updated_at")
    inlines = (ReportImageInline, ReportStatusLogInline)
