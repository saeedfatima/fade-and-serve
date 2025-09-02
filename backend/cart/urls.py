from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove-from-cart'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),
    path('credit-topups/', views.CreditTopUpListCreateView.as_view(), name='credit-topups'),
    path('service-availability/', views.ServiceAvailabilityListView.as_view(), name='service-availability'),
    path('service-availability/create/', views.ServiceAvailabilityCreateView.as_view(), name='create-service-availability'),
    path('equipment/', views.EquipmentListView.as_view(), name='equipment-list'),
]