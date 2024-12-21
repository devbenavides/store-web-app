from django.shortcuts import render, get_object_or_404
from ..models.client import Client
from django.http import JsonResponse

# Create your views here.


def serchById(request):
    if 'number_identification' in request.GET:
        number_identification = request.GET.get('number_identification')
        try:
            client = get_object_or_404(Client, number_identification=number_identification)
            data_client = {
                'id': client.id,
                'type_identification': client.type_identification,
                'number_identification': client.number_identification,
                'first_name': client.first_name,
                'second_name': client.second_name,
                'last_name': client.last_name,
                'second_last_name': client.second_last_name,
                'phone_number': client.phone_number,
                'phone_number_aux': client.phone_number_aux,
                'email_address': client.email_address,
            }
            return JsonResponse(data_client)
        except ValueError:
            return JsonResponse({'error':'El cliente no se encuentra regustrado'})
