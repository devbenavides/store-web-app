from django.urls import path
from .views import category_views,product_views, provider_views,order_views,sale_views

urlpatterns = [

    path('category/', category_views.getAllCategory, name='list_categorys'),
    path('category/create/', category_views.createCategory, name='create_category'),
    path('category/<int:category_id>/', category_views.detailCategory, name='detail_category'),
    path('category/delete/<int:category_id>/', category_views.deleteCategory, name='delete_category'),

    path('product/', product_views.getAllProduct, name='list_products'),
    path('product/create/', product_views.createProduct, name='create_product'),
    path('product/<int:product_id>/', product_views.detailProduct, name='detail_product'),
    path('product/delete/<int:product_id>/', product_views.deleteProduct, name='delete_product'),
    path('product/search-product/', product_views.searchCodeProduct, name='search_code_product'),
    #path('product/search-name-product/', product_views.searchCodeProduct, name='search_code_product'),


    path('provider/', provider_views.getAllProvider,name='list_providers'),
    path('provider/create/',provider_views.createProvider,name='create_provider'),
    path('provider/<int:provider_id>/',provider_views.editProvider,name='edit_provider'),
    path('provider/delete/<int:provider_id>/',provider_views.deleteProvider,name='delete_provider'),

    path('order/',order_views.getAllOrder,name='list_orders'),
    path('order/create/',order_views.createOrder,name='create_order'),
    path('order/<int:order_id>/',order_views.editOrder,name='edit_order'),
    path('order/delete/<int:order_id>/',order_views.deleteOrder,name='delete_order')
]

