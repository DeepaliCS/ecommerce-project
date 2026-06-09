from django.contrib import admin
from django.urls import path, include
from .stripe_views import create_payment_intent

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
    path('api/create-payment-intent/', create_payment_intent),
]