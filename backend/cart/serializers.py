from rest_framework import serializers
from .models import Cart, CartItem, CreditTopUp, ServiceAvailability, Equipment
from services.serializers import ServiceSerializer


class CartItemSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'service', 'service_id', 'quantity', 'use_new_equipment', 
                 'equipment_surcharge', 'total_price', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField()
    items_count = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount', 'items_count', 'created_at', 'updated_at']


class CreditTopUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTopUp
        fields = ['id', 'amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']


class ServiceAvailabilitySerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.IntegerField(write_only=True)
    is_available = serializers.ReadOnlyField()
    remaining_slots = serializers.ReadOnlyField()

    class Meta:
        model = ServiceAvailability
        fields = ['id', 'service', 'service_id', 'date', 'start_time', 'end_time', 
                 'capacity', 'booked_count', 'is_home_service', 'is_available', 
                 'remaining_slots', 'created_at']


class EquipmentSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'surcharge', 'is_new', 'services', 'created_at']