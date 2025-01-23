from django.shortcuts import render, redirect, get_object_or_404
from ..models.product import Product
from ..models.category import Category
from ..forms.product_forms import ProductForm
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.urls import reverse
from django.db.models import Q,F

# Create your views here.


def getAllProduct(request):
    products = Product.objects.order_by('id')
    return render(request, 'product/products.html', {'products': products})


def createProduct(request):
    if request.method == 'GET':
        return render(request, 'product/create_product.html', {'form': ProductForm})
    else:
        try:
            # request.POST['category'] = int(request.POST['category'])
            newProduct = Product()
            form = ProductForm(request.POST)
            if form.is_valid():
                newProduct = form.save(commit=False)
                newProduct.save()
                return JsonResponse({'success': True, 'msm': 'Producto agregado'})
            else:
                return render(request, 'product/create_product.html', {'form': form})
        except ValueError:
            return render(
                request,
                'product/create_product.html',
                {
                    'form': ProductForm,
                    'error': 'Validar información'
                }
            )


def detailProduct(request, product_id):
    if request.method == 'GET':
        product = get_object_or_404(Product, pk=product_id)
        form = ProductForm(instance=product)
        return render(request, 'product/detail_product.html', {'product': product, 'form': form})
    else:
        try:
            product = get_object_or_404(Product, pk=product_id)
            form = ProductForm(request.POST, instance=product)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True, 'msm': 'Producto actualizado'})
            else:
                return render(request, 'product/detail_product.html', {'product': product, 'form': form})
        except ValueError as e:
            print(f'Error edit ',e)
            return render(
                request,
                'product/detail_product.html',
                {
                    'product': product,
                    'form': form,
                    'error': 'Error al actualizar el producto'
                }
            )


@require_http_methods(["DELETE"])
def deleteProduct(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    product.delete()
    return JsonResponse({'product': product.name_product})


def searchCodeProduct(request):
    if 'code_product' in request.GET:
        code_product = request.GET.get('code_product')
        try:
            product = get_object_or_404(Product, code_product=code_product)
            
            data = {
                'id':product.id,
                'code_product': product.code_product,
                'unit_sale_price':product.unit_sale_price,
                'name_product': product.name_product,
                'stock_product':product.stock_product
            }
            print(data)
            return JsonResponse(data)
        except ValueError:
            return JsonResponse({'error':'Producto no encontrado'},status=404)
        
def searchNameCategoryProduct(request):
    
    if 'name_category_product' in request.GET:
        name_category_product = request.GET.get('name_category_product','')
        try:
            products = Product.objects.none()

            products = Product.objects.filter(
                Q(name_product__icontains=name_category_product) |
                Q(category__name_category__icontains=name_category_product)
            ).annotate(
                name_category=F('category__name_category')
            ).values(
                'id',
                'code_product',
                'name_product',
                'name_category',
                'unit_sale_price',
                'stock_product')
            
            product_list = list(products)
            
            for product in product_list:
                product['unit_sale_price'] = float(product['unit_sale_price'])
            print(f'products {product_list}')

            return JsonResponse({'product_list':product_list})
        except ValueError:
            return JsonResponse({'error':'Error en la busqueda por nombre o categoria'})
