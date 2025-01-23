from django.urls import path
from .views import views

urlpatterns = [
    path('search-number-id/',views.serchById, name='search_client_number_id'),
    path('create-client/',views.createClient, name='create_client')
]