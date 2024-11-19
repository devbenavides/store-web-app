from django.contrib import admin
from .models import invoice,sale

# Register your models here.
admin.site.register(invoice.Invoice)
admin.site.register(sale.Sale)