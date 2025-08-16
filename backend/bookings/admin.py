from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'service', 'appointment_date', 'appointment_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date', 'service', 'created_at')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'service__name')
    list_editable = ('status',)
    date_hierarchy = 'appointment_date'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'service')