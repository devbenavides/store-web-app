from django.db import models
from .invoice import Invoice
from apps.inventory.models.product import Product

class Sale(models.Model):
    quantity = models.DecimalField(max_digits=10,decimal_places=2,null=True)
    sales_price = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    invoice =  models.ForeignKey(Invoice,on_delete=models.RESTRICT)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)

    class Meta:
        db_table = 'sales'