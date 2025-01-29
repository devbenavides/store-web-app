from django.urls import path
from .views import sale_views

urlpatterns = [
    path('',sale_views.getFormSales,name='get_form_sales'),
    path('all',sale_views.getAllSales,name='get_all_sales'),
    path('search-name-product/',sale_views.searchNameCategoryProduct,name='search_name_product'),
    path('create/',sale_views.createSale,name='create_sale')

]