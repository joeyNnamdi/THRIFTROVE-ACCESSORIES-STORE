from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from django.conf import settings

def store(request):
    return render(request, 'shop/index.html')


@csrf_exempt
def pudo_lockers(request):
    """
    Fetch locker locations from PUDO API (for dropdown selection)
    """
    try:
        response = requests.get(
            "https://sandbox.api-pudo.co.za/api/v1/guest/lockers-data",
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse({"error": f"PUDO API returned {response.status_code}"}, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def pudo_quote(request):
    """
    Get delivery cost estimate from PUDO API
    """
    if request.method == "POST":
        delivery_type = request.POST.get("delivery_type")
        address = request.POST.get("address")
        postal_code = request.POST.get("postal_code")
        collection_terminal = request.POST.get("collection_terminal", "CG107")  # Example pickup
        delivery_terminal = request.POST.get("delivery_terminal", "CG929")      # Example dropoff

        payload = {
            "collection_address": {"terminal_id": collection_terminal},
            "delivery_address": {"terminal_id": delivery_terminal}
        }

        # If it's home delivery, adjust payload accordingly
        if delivery_type == "HOME":
            payload = {
                "collection_address": {"terminal_id": collection_terminal},
                "delivery_address": {
                    "address_line_1": address,
                    "postal_code": postal_code
                }
            }

        try:
            response = requests.post(
                "https://sandbox.api-pudo.co.za/api/v1/rates",
                headers={
                    "Authorization": f"Bearer {settings.PUDO_API_KEY}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json=payload,
                timeout=10,
            )

            if response.status_code == 200:
                pudo_response = response.json()
                return JsonResponse(pudo_response)
            else:
                return JsonResponse(
                    {"error": f"PUDO API returned {response.status_code}: {response.text}"},
                    status=response.status_code
                )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
