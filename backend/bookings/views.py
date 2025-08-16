from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer, BookingUpdateSerializer

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['staff', 'admin']:
            return Booking.objects.all().select_related('user', 'service')
        return Booking.objects.filter(user=user).select_related('service')

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['staff', 'admin']:
            return Booking.objects.all().select_related('user', 'service')
        return Booking.objects.filter(user=user).select_related('service')

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            user = self.request.user
            if user.role in ['staff', 'admin']:
                return BookingUpdateSerializer
            # Regular users can only cancel their bookings
            return BookingUpdateSerializer
        return BookingSerializer

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        user = request.user
        
        # Regular users can only cancel their own pending bookings
        if user.role == 'user':
            if booking.user != user:
                return Response(
                    {'error': 'You can only modify your own bookings'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if booking.status != 'pending':
                return Response(
                    {'error': 'You can only cancel pending bookings'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            if 'status' in request.data and request.data['status'] != 'cancelled':
                return Response(
                    {'error': 'You can only cancel bookings'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return super().update(request, *args, **kwargs)