from django.urls import path
from . import views

urlpatterns = [
    path('', views.store, name='store'),
    path('pudo/quote/', views.pudo_delivery_quote, name='pudo_quote'),
]
