import json
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import Locker, Order

def store(request):
    # your product listing logic here
    return render(request, 'shop/index.html')

@csrf_exempt
def pudo_lockers(request):
    if request.method == "GET":
        resp = requests.get(
            "https://api-pudo.co.za/api/v1/guest/lockers-data",
            headers={"Authorization": f"Bearer {settings.PUDO_API_KEY}"}
        )
        try:
            data = resp.json()
        except ValueError:
            return JsonResponse({"error": "Invalid JSON", "raw": resp.text}, status=500)
        # Optionally save lockers locally
        for l in data:
            Locker.objects.update_or_create(
                terminal_id = l.get("terminal_id"),
                defaults = {
                    "name": l.get("name"),
                    "suburb": l.get("suburb"),
                    "city": l.get("city"),
                    "lat": l.get("lat"),
                    "lng": l.get("lng"),
                }
            )
        return JsonResponse(data, safe=False)
    return JsonResponse({"error": "Invalid method"}, status=400)

@csrf_exempt
def pudo_quote(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=400)

    body = json.loads(request.body)
    resp = requests.post(
        "https://sandbox.api-pudo.co.za/api/v1/rates",
        headers={
            "Authorization": f"Bearer {settings.PUDO_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        json=body,
        timeout=15
    )
    try:
        data = resp.json()
    except ValueError:
        return JsonResponse({"error": "Invalid JSON", "raw": resp.text, "status": resp.status_code}, status=500)
    # Create an Order record (example)
    order = Order.objects.create(
        user = request.user if request.user.is_authenticated else None,
        total_amount = sum(item["price"] for item in request.session.get("cart", [])),
        delivery_type = body.get("delivery_type"),
        locker = Locker.objects.filter(terminal_id=body.get("delivery_address", {}).get("terminal_id")).first() if body.get("delivery_type")=="locker" else None,
        quote_data = data,
        submitted = False
    )
    return JsonResponse({"order_id": order.id, "quote": data})

def checkout_confirm(request, order_id):
    order = Order.objects.get(id=order_id)
    # Render confirmation page where user carries out payment and confirms
    return render(request, 'shop/checkout_confirm.html', {"order": order})
