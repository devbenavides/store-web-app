from django.shortcuts import render, redirect, get_object_or_404
from ..models.category import Category
from ..forms.category_forms import CategoryForm
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

# Create your views here.


@login_required
def getAllCategory(request):
    categorys = Category.objects.all()
    return render(request, 'category/categorys.html', {'categorys': categorys})


@login_required
def createCategory(request):

    if request.method == 'GET':
        return render(request, 'category/create_category.html', {'form': CategoryForm})
    else:
        try:
            form = CategoryForm(request.POST)
            if form.is_valid():
                newCategory = form.save(commit=False)
                newCategory.save()
                return JsonResponse({'success': True, 'msm': 'Categoria agregada'})
            else:
                return render(request, 'category/create_category.html', {'form': form})

        except ValueError:
            return render(
                request,
                'category/create_category.html',
                {
                    'form': CategoryForm,
                    'error': 'Validar información'
                }
            )


@login_required
def detailCategory(request, category_id):
    if request.method == 'GET':
        category = get_object_or_404(Category, pk=category_id)
        form = CategoryForm(instance=category)
        return render(request, 'category/detail_category.html', {'category': category, 'form': form})
    else:
        try:
            category = get_object_or_404(Category, pk=category_id)
            form = CategoryForm(request.POST, instance=category)
            if form.is_valid:
                form.save()
                return JsonResponse({'success': True, 'msm': 'Categoria actualizada'})
            else:
                return render(request, 'category/detail_category.html', {'form': form})
        except ValueError:
            return render(request, 'category/detail_category.html', {'category': category, 'form': form, 'error': 'Error al actualizar la categoria'})


@login_required
@require_http_methods(["DELETE"])
def deleteCategory(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    category.delete()
    return JsonResponse({'category': category.name_category})
