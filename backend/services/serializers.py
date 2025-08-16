from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    duration_display = serializers.ReadOnlyField()

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'duration_minutes', 'duration_display', 'is_active']