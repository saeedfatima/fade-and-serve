from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from .models import Cart, CartItem, CreditTopUp, ServiceAvailability, Equipment
from services.models import Service

User = get_user_model()


class CartTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.service = Service.objects.create(
            name='Test Service',
            description='Test description',
            price=Decimal('50.00'),
            duration=60,
            is_active=True
        )

    def test_cart_creation(self):
        """Test cart is created automatically for user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/cart/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items_count'], 0)
        self.assertEqual(float(response.data['total_amount']), 0.0)

    def test_add_to_cart(self):
        """Test adding items to cart"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'service_id': self.service.id,
            'quantity': 2,
            'use_new_equipment': False
        }
        
        response = self.client.post('/api/cart/add/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check cart contents
        cart_response = self.client.get('/api/cart/')
        self.assertEqual(cart_response.data['items_count'], 1)
        self.assertEqual(float(cart_response.data['total_amount']), 100.0)  # 50 * 2

    def test_remove_from_cart(self):
        """Test removing items from cart"""
        self.client.force_authenticate(user=self.user)
        
        # Add item first
        self.client.post('/api/cart/add/', {
            'service_id': self.service.id,
            'quantity': 1
        })
        
        # Get cart item ID
        cart_response = self.client.get('/api/cart/')
        item_id = cart_response.data['items'][0]['id']
        
        # Remove item
        response = self.client.delete(f'/api/cart/remove/{item_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Check cart is empty
        cart_response = self.client.get('/api/cart/')
        self.assertEqual(cart_response.data['items_count'], 0)


class ServiceAvailabilityTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.service = Service.objects.create(
            name='Test Service',
            description='Test description',
            price=Decimal('50.00'),
            duration=60,
            is_active=True
        )

    def test_service_availability_list(self):
        """Test listing service availability"""
        ServiceAvailability.objects.create(
            service=self.service,
            date='2024-01-15',
            start_time='10:00',
            end_time='11:00',
            capacity=2,
            is_home_service=False
        )
        
        response = self.client.get('/api/service-availability/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['is_available'])
        self.assertEqual(response.data[0]['remaining_slots'], 2)

    def test_service_availability_filtering(self):
        """Test filtering service availability"""
        ServiceAvailability.objects.create(
            service=self.service,
            date='2024-01-15',
            start_time='10:00',
            end_time='11:00',
            capacity=1,
            is_home_service=True
        )
        
        response = self.client.get('/api/service-availability/?is_home_service=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['is_home_service'])


class CreditTopUpTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_credit_topup(self):
        """Test creating a credit top-up"""
        self.client.force_authenticate(user=self.user)
        
        data = {'amount': '100.00'}
        response = self.client.post('/api/credit-topups/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data['amount']), 100.0)
        self.assertEqual(response.data['status'], 'pending')

    def test_list_credit_topups(self):
        """Test listing user's credit top-ups"""
        self.client.force_authenticate(user=self.user)
        
        CreditTopUp.objects.create(user=self.user, amount=Decimal('50.00'))
        
        response = self.client.get('/api/credit-topups/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]['amount']), 50.0)