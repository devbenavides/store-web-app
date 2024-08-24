from django.shortcuts import render, redirect, get_object_or_404
from ..models.product import Product
from ..models.category import Category
from ..forms.product_forms import ProductForm
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

# Create your views here.


def getAllProduct(request):
    products = Product.objects.all()
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
                return JsonResponse({'success':True, 'msm':'Producto agregado'})
            else:
                return render(request,'product/create_product.html',{'form':form})
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
                return JsonResponse({'success':True,'msm':'Producto actualizado'})
            else:
                return render(request,'product/detail_product.html',{'product': product,'form':form})
        except ValueError:
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
def deleteProduct(request,product_id):
    product = get_object_or_404(Product,pk=product_id)
    product.delete()
    return JsonResponse({'product':product.name_product})