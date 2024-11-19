from django.contrib import admin
from .models import category, product, provider, order

# Register your models here.
admin.site.register(category.Category)
admin.site.register(product.Product)
admin.site.register(provider.Provider)
admin.site.register(order.Order)
