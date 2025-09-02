from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, CreditTopUp, ServiceAvailability, Equipment
from .serializers import (
    CartSerializer, CartItemSerializer, CreditTopUpSerializer, 
    ServiceAvailabilitySerializer, EquipmentSerializer
)
from services.models import Service


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    """Add item to cart or update quantity if exists"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    service_id = request.data.get('service_id')
    quantity = request.data.get('quantity', 1)
    use_new_equipment = request.data.get('use_new_equipment', False)
    equipment_surcharge = request.data.get('equipment_surcharge', 0)
    
    try:
        service = Service.objects.get(id=service_id, is_active=True)
    except Service.DoesNotExist:
        return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        service=service,
        use_new_equipment=use_new_equipment,
        defaults={
            'quantity': quantity,
            'equipment_surcharge': equipment_surcharge
        }
    )
    
    if not created:
        cart_item.quantity += int(quantity)
        cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """Clear all items from cart"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)


class CreditTopUpListCreateView(generics.ListCreateAPIView):
    serializer_class = CreditTopUpSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CreditTopUp.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ServiceAvailabilityListView(generics.ListAPIView):
    serializer_class = ServiceAvailabilitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = ServiceAvailability.objects.filter(is_available=True)
        service_id = self.request.query_params.get('service_id')
        date = self.request.query_params.get('date')
        is_home_service = self.request.query_params.get('is_home_service')
        
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        if date:
            queryset = queryset.filter(date=date)
        if is_home_service is not None:
            queryset = queryset.filter(is_home_service=is_home_service.lower() == 'true')
        
        return queryset


class ServiceAvailabilityCreateView(generics.CreateAPIView):
    serializer_class = ServiceAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]  # Add admin check in production

    def perform_create(self, serializer):
        serializer.save()


class EquipmentListView(generics.ListAPIView):
    queryset = Equipment.objects.filter(is_new=True)
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny]