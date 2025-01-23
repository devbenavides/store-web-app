from django.shortcuts import render, get_object_or_404
from ..forms.invoice_forms import InvoiceForm
from ..forms.sale_forms import SaleForm
from django.urls import reverse
from django.utils import timezone
from django.contrib import messages
from django.http import JsonResponse
from ..models.invoice import Invoice
from ..models.sale import Sale
from apps.inventory.models.product import Product
from apps.clients.models.client import Client
from django.db.models import Max
import json


def gertAllSale(request):
    date_utc = timezone.now()
    today = timezone.localtime(date_utc)
    searchCodeProduct = reverse('search_code_product')
    searchNameCategory = reverse('search_name_category')
    searchClientNumberId = reverse('search_client_number_id')
    numberInvoice = generate_code_invoice()
    return render(request, 'sale.html', {
        'form_invoice': InvoiceForm,
        'form_sale': SaleForm,
        'searchCodeProduct': searchCodeProduct,
        'searchNameCategory': searchNameCategory,
        'searchClientNumberId': searchClientNumberId,
        'numberInvoice': numberInvoice})


def searchNameCategoryProduct(request):
    if request.method == 'GET':
        return render(request, 'search_product.html')


def createSale(request):
    try:
        product_sale_error=[]
        sales_created =[]
        invoice_error=[]
        errors=[]

        data = json.loads(request.body.decode('utf-8'))

        code_invoice = generate_code_invoice()
        payment_method = data['payment_method']
        total_invoice = float(data['total'])
        cash_received = float(data['cash_received'])
        cash_change = float(data['cash_change'])
        client_id = int(data['id_client'])
        
        product_list = data['products']

        if not code_invoice:
            errors.append({'code_invoice':'Error al generar código de factura.'})
        if not payment_method:
            errors.append({'payment_method':'Error en el metodo de pago.'})
        if not total_invoice:
            errors.append({'total_invoice':'Total esta vacio.'})
        if not cash_received and payment_method=='cash':
            errors.append({'cash_received':'No ha recibido el dinero.'})
        if not client_id or client_id == 0:
            errors.append({'id_client':'Cliente no seleccionado.'})
        else:
            client = Client.objects.get(pk=client_id)
            if not client:
                errors.append({'client':'Cliente no econtrado.'})
        if not product_list:
            errors.append({'products':'Debe agregar productos a la lista.'})

        if not errors:
            newInvoice = Invoice()
            if (cash_received >= total_invoice):
                newInvoice.code_invoice = code_invoice
                newInvoice.payment_method = payment_method
                newInvoice.total_invoice = total_invoice
                newInvoice.cash_received = cash_received
                newInvoice.cash_change = cash_received - total_invoice
                newInvoice.client = client

                newInvoice.save()

                invoice = newInvoice
                if newInvoice.id is None:
                    errors.append({'create_invoice':'Error al crear la factura'})

                for sale in product_list:
                    newSale = Sale()

                    quantity = float(sale['quantity'])
                    sales_price = float(sale['unit_sale_price'])
                    product = Product.objects.get(id=sale['id'])

                    if (invoice and product and quantity > 0 and sales_price > 0):
                        newSale.quantity = quantity
                        newSale.sales_price = sales_price
                        newSale.invoice = newInvoice
                        newSale.product = product

                        newSale.save()

                        if newSale.id is None:
                            product_sale_error.append(sale)
                    else:
                        errors.append({'create_sale':'Error en la lista de productos'})

        
        return JsonResponse({
            'success':len(errors)==0,
            'errors':errors
        })
    except ValueError:
        return JsonResponse({'error':'Error en el servidor'})


def generate_code_invoice():
    last_code = Invoice.objects.aggregate(Max('code_invoice'))[
        'code_invoice__max']

    if last_code:
        current_number = int(last_code.split('-')[1])
    else:
        current_number = 0

    next_number = current_number + 1

    code = f"FAC-{str(next_number).zfill(6)}"
    return code
