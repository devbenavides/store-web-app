from django.shortcuts import render, get_object_or_404
from ..models.provider import Provider
from ..forms.provider_forms import ProviderForm
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


def getAllProvider(request):
    provider = Provider.objects.all()
    return render(request, 'provider/providers.html', {'providers': provider})


def createProvider(request):
    if request.method == 'GET':
        return render(request, 'provider/create_provider.html', {'form': ProviderForm})
    else:
        try:
            form = ProviderForm(request.POST)
            if form.is_valid():
                newProvider = form.save(commit=False)
                newProvider.save()
                return JsonResponse({'success': True, 'msm': 'Proveedor agregado'})
            else:
                return render(request, 'provider/create_provider.html', {'form': form})
        except ValueError:
            return render(
                request,
                'provider/create_provider.html',
                {
                    'form': ProviderForm,
                    'error': 'Validar informacion'
                }
            )


def editProvider(request, provider_id):

    if request.method == 'GET':
        provider = get_object_or_404(Provider, pk=provider_id)
        form = ProviderForm(instance=provider)
        return render(request, 'provider/edit_provider.html', {'provider': provider, 'form': form})
    else:
        try:
            provider = get_object_or_404(Provider, pk=provider_id)
            form = ProviderForm(request.POST, instance=provider)

            if form.is_valid():
                form.save()
                return JsonResponse({'success': True, 'msm': 'Proveedor actualizado'})
            else:
                return render(request, 'provider/edit_provider.html', {'provider': provider, 'form': form})

        except ValueError:
            return render(request, 'provider/edit_provider.html', {'provider': provider, 'form': form, 'error': 'Error al actualizar el proveedor'})


@require_http_methods(["DELETE"])
def deleteProvider(request, provider_id):
    provider = get_object_or_404(Provider, pk=provider_id)
    provider.delete()
    return JsonResponse({'provider': provider.name_provider})
