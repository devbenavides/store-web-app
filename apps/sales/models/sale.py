from django.db import models
from .invoice import Invoice
from apps.inventory.models.product import Product
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal

class Sale(models.Model):
    quantity = models.DecimalField(max_digits=10,decimal_places=2,null=True)
    sales_price = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    invoice =  models.ForeignKey(Invoice,on_delete=models.RESTRICT)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)

    class Meta:
        db_table = 'sales'

""" 
ejecutar signal al guardar una venta
restar la cantidad vendida al stock de producto
 """
@receiver(post_save,sender=Sale)
def subtractQuantity(sender, instance,created, **kwargs):
    if created:
        product = instance.product
        if product.stock_product >= instance.quantity:
            product.stock_product -= Decimal(instance.quantity)
            product.save()
        else:
            raise ValueError(f'Stock insuficiente para el producto {product.name_product}')

    