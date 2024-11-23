from django.shortcuts import render,get_object_or_404
from ..forms.invoice_forms import InvoiceForm
from ..forms.sale_forms import SaleForm
from django.urls import reverse

def gertAllSale(request):
    searchCodeProduct = reverse('search_code_product')
    searchNameCategory = reverse('search_name_category')
    return render(request,'sale.html',{'form_invoice':InvoiceForm,'form_sale':SaleForm,'searchCodeProduct':searchCodeProduct,'searchNameCategory':searchNameCategory})

def searchNameCategoryProduct(request):
    if request.method == 'GET':
       return render(request,'search_product.html')