from django.contrib import admin
from .models import Cart, CartItem, CreditTopUp, ServiceAvailability, Equipment


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'items_count', 'total_amount', 'created_at']
    readonly_fields = ['total_amount', 'items_count']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'service', 'quantity', 'use_new_equipment', 'total_price']
    list_filter = ['use_new_equipment', 'created_at']


@admin.register(CreditTopUp)
class CreditTopUpAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['payment_intent_id']


@admin.register(ServiceAvailability)
class ServiceAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['service', 'date', 'start_time', 'end_time', 'capacity', 'booked_count', 'is_home_service']
    list_filter = ['is_home_service', 'date', 'service']
    ordering = ['date', 'start_time']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'surcharge', 'is_new', 'created_at']
    list_filter = ['is_new', 'created_at']
    filter_horizontal = ['services']