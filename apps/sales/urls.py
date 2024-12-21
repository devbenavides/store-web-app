from django.urls import path
from .views import sale_views

urlpatterns = [
    path('',sale_views.gertAllSale,name='list_sales'),
    path('search-name-product/',sale_views.searchNameCategoryProduct,name='search_name_product'),
    path('create/',sale_views.createSale,name='create_sale')

]