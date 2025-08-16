from rest_framework import serializers
from .models import Booking
from services.models import Service
from accounts.serializers import UserProfileSerializer

class BookingCreateSerializer(serializers.ModelSerializer):
    service_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = ['service_id', 'appointment_date', 'appointment_time', 'notes']

    def validate_service_id(self, value):
        try:
            service = Service.objects.get(id=value, is_active=True)
            return value
        except Service.DoesNotExist:
            raise serializers.ValidationError("Invalid service selected")

    def create(self, validated_data):
        service_id = validated_data.pop('service_id')
        service = Service.objects.get(id=service_id)
        validated_data['service'] = service
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField()
    service_price = serializers.ReadOnlyField()
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'service_name', 'service_price', 
            'appointment_date', 'appointment_time', 'status', 
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'service_name', 'service_price', 'created_at', 'updated_at']

class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status', 'notes']