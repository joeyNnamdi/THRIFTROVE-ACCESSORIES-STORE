from django.shortcuts import render

# Create your views here.
def store(request):
    return render(request, 'shop/index.html')