from django.db import models
from django.conf import settings
from services.models import Service
from decimal import Decimal


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.full_name}"

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def items_count(self):
        return self.items.count()


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    use_new_equipment = models.BooleanField(default=False)
    equipment_surcharge = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['cart', 'service', 'use_new_equipment']

    def __str__(self):
        return f"{self.service.name} x{self.quantity} in {self.cart.user.full_name}'s cart"

    @property
    def total_price(self):
        base_price = self.service.price * self.quantity
        equipment_cost = self.equipment_surcharge * self.quantity if self.use_new_equipment else Decimal('0.00')
        return base_price + equipment_cost


class CreditTopUp(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='credit_topups')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_intent_id = models.CharField(max_length=255, blank=True, null=True)  # For payment provider integration
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Credit top-up of ${self.amount} for {self.user.full_name}"


class ServiceAvailability(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='availability_windows')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField(default=1)
    booked_count = models.PositiveIntegerField(default=0)
    is_home_service = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['service', 'date', 'start_time', 'is_home_service']
        ordering = ['date', 'start_time']

    def __str__(self):
        service_type = "Home Service" if self.is_home_service else "In-Store"
        return f"{self.service.name} - {service_type} on {self.date} {self.start_time}-{self.end_time}"

    @property
    def is_available(self):
        return self.booked_count < self.capacity

    @property
    def remaining_slots(self):
        return max(0, self.capacity - self.booked_count)


class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    surcharge = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    is_new = models.BooleanField(default=True)
    services = models.ManyToManyField(Service, related_name='equipment_options', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (+${self.surcharge})"