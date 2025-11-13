from django.urls import path
from . import views

urlpatterns = [
    path('', views.store, name='store'),
    path('pudo/lockers/', views.pudo_lockers, name='pudo_lockers'),
    path('pudo/quote/', views.pudo_quote, name='pudo_quote'),
    path('checkout/confirm/<int:order_id>/', views.checkout_confirm, name='checkout_confirm'),
]

urlpatterns = [
    path('', views.store, name='store'),
    path('cart/', views.view_cart, name='cart'),
    path('add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('pudo/quote/', views.pudo_quote, name='pudo_quote'),
]
