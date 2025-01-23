from django.shortcuts import render, get_object_or_404
from ..models.client import Client
from ..forms.client_forms import ClientForm
from django.http import JsonResponse, Http404
import json

# Create your views here.


def serchById(request):
    if 'number_identification' in request.GET:
        number_identification = request.GET.get('number_identification')
        try:
            client = get_object_or_404(Client, number_identification=number_identification)
            print(f'Client {client}')
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
        except Http404:
            return JsonResponse({'message': 'El cliente no se encuentra registrado'},status=404)

def createClient(request):
    if request.method == 'GET':
        return render(request,'create_client.html',{'form':ClientForm})
    else:
        try:
            #data = json.loads(request.body)
            #form = ClientForm(data)
            form = ClientForm(request.POST)
            
            if form.is_valid():
                newClient = form.save(commit=False)
                newClient.save()
                return JsonResponse({'success':True,'msm':'Cliente agregado','number_id':newClient.number_identification})
            else:
                print(form.errors)
                return JsonResponse({'succes':False,'errors':form.errors})
        except ValueError:
            return render(
                request,
                'create_client.html',
                {
                    'form':ClientForm,
                    'error':'Validar información'
                }
            )