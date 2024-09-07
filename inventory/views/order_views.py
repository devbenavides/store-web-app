from django.shortcuts import render, redirect, get_object_or_404
from ..models.order import Order
from ..models.product import Product
from ..models.provider import Provider
from ..forms.order_forms import OrderForm
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.urls import reverse


def getAllOrder(request):
    orders = Order.objects.all()
    return render(request, 'order/orders.html', {'orders': orders})


def createOrder(request):
    today = timezone.now().date()
    searchCodeProduct= reverse('search_code_product')
    create_order = reverse('create_order')
    if request.method == 'GET':
        return render(request, 'order/create_order.html', {'form': OrderForm,'today':today,'searchCodeProduct':searchCodeProduct,'create_order':create_order})
    else:
        try:
            newOrder = Order()
            form = OrderForm(request.POST)
            
            if form.is_valid():
                newOrder = form.save(commit=False)
                newOrder.save()
                order = {
                    'id':newOrder.id,
                    'name_product':newOrder.product.name_product,
                    'quantity':newOrder.quantity,
                    'buy_price':newOrder.buy_price,
                    'sale_price':newOrder.sale_price,
                    'name_provider':newOrder.provider.name_provider
                }
                return JsonResponse({'success': True, 'order': order})
            else:
                
                return JsonResponse({'success': False, 'error': form.errors}, status=400)
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Validar informacion'}, status=400)
        
