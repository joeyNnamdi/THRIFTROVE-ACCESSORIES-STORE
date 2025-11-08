from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# --- Store Homepage ---
def store(request):
    return render(request, 'shop/index.html')


# --- PUDO Delivery Quote View ---
@csrf_exempt
def pudo_delivery_quote(request):
    """
    Get delivery options from PUDO API (pickup or home delivery)
    """
    if request.method == "POST":
        data = request.POST
        customer_address = data.get("address")
        postal_code = data.get("postal_code")

        # Example payload based on PUDO docs
        payload = {
            "collectionType": "PUDO",
            "deliveryType": "HOME",
            "postalCode": postal_code,
            "address": customer_address,
        }

        try:
            response = requests.post(
                "https://api.pudo.co.za/api/v1/guest/lockers-data",
                headers={
                    "Authorization": f"Bearer {settings.PUDO_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=10,
            )
            pudo_response = response.json()
            return JsonResponse(pudo_response)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
