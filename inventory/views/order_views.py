from django.shortcuts import render, redirect, get_object_or_404
from ..models.order import Order
from ..models.product import Product
from ..models.provider import Provider
from ..forms.order_forms import OrderForm
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.urls import reverse
from django.core.paginator import Paginator
import json


def getAllOrder(request):
    orders = Order.objects.order_by('id')
    per_page = int(request.GET.get('records_per_page', 10))
    paginator = Paginator(orders, per_page)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'order/orders.html', {'orders': page_obj})


def createOrder(request):
    today = timezone.now().date()
    searchCodeProduct = reverse('search_code_product')
    create_order = reverse('create_order')
    if request.method == 'GET':
        return render(request, 'order/create_order.html', {'form': OrderForm, 'today': today, 'searchCodeProduct': searchCodeProduct, 'create_order': create_order})
    else:
        try:

            data = json.loads(request.body.decode('utf-8'))
            save_items = []
            error_items = []

            for order in data['products']:

                form = OrderForm(order)
                if form.is_valid():
                    order_created = form.save()
                    save_items.append({
                        'id': order_created.id,
                        'name_product': order_created.product.name_product,
                        'quantity': order_created.quantity,
                        'buy_price': order_created.buy_price,
                        'sale_price': order_created.sale_price,
                        'name_provider': order_created.provider.name_provider
                    })
                else:
                    error_items.append({
                        'order_item': order,
                        'errors': form.errors
                    })

            return JsonResponse(
                {
                    'success': len(error_items) == 0,
                    'save_items': save_items,
                    'error_item': error_items
                }, status=200 if not error_items else 400)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Validar JSON'}, status=400)


def editOrder(request, order_id):
    today = timezone.now().date()
    searchCodeProduct = reverse('search_code_product')
    create_order = reverse('create_order')
    if request.method == 'GET':
        order = get_object_or_404(Order, pk=order_id)
        date_order = order.date_order.strftime('%Y-%m-%d')
        
        form = OrderForm(instance=order)
        #form.initial['date_order']=date_order
        return render(request, 'order/edit_order.html', {'order': order, 'form': form,'today': today, 'searchCodeProduct': searchCodeProduct, 'create_order': create_order})
    else:
        try:
            order = get_object_or_404(Order, pk=order_id)
            data = json.loads(request.body) 
            form = OrderForm(data,instance=order)
            if(request.method == 'POST'):
                print(f'data form ',data)

            if form.is_valid():
                #form.save()
                print('Form is valid')
                return JsonResponse({'success':True,'msm':'Pedido actualizado'})
            else:
                return JsonResponse({'success':False,'errors':form.errors})

        except ValueError:
            return render(
                request,
                'order/edit_order.html', {'order': order, 'form': form,'error':'Error al actualizar pedido'}
            )


def editOrder_(request):
    edit_order_url = reverse('edit_order')
    if request.method == 'GET':
        order_id = request.GET.get('order_id')
        try:
            order = get_object_or_404(Order, pk=order_id)
            data = {
                'id': order.id,
                'number_invoice': order.number_invoice,
                'quantity': order.quantity,
                'buy_price': order.buy_price,
                'sale_price': order.sale_price,
                'expiration_date': order.expiration_date,
                'date_order': order.date_order,
                'product_id': order.product.id,
                'provider_id': order.provider.id,
            }
            return JsonResponse({'data': data, 'edit_order_url': edit_order_url})
        except ValueError:
            return
