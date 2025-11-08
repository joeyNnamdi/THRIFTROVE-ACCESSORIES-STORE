from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.store, name='store'),
    path('pudo/lockers/', views.pudo_lockers, name='pudo_lockers'),
    path('pudo/quote/', views.pudo_quote, name='pudo_quote'),
    path('checkout/confirm/<int:order_id>/', views.checkout_confirm, name='checkout_confirm'),
    path('', include('shop.urls')),

]
