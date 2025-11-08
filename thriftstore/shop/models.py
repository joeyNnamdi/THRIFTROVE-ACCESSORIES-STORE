from django.db import models
from django.contrib.auth.models import User

class Locker(models.Model):
    terminal_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    suburb = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return f"{self.name} – {self.suburb}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_type = models.CharField(max_length=20, choices=(("home","Home Delivery"), ("locker","Locker Pickup")))
    locker = models.ForeignKey(Locker, on_delete=models.SET_NULL, null=True, blank=True)
    quote_data = models.JSONField(blank=True, null=True)
    submitted = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} – {self.delivery_type}"
