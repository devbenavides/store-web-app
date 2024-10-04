from django.db import models
from .product import Product
from .provider import Provider
from decimal import Decimal
from django.db.models.signals import post_save
from django.dispatch import receiver

class Order(models.Model):
    number_invoice = models.CharField(max_length=100,null=True, blank=True)
    quantity = models.DecimalField(max_digits=10,decimal_places=2)
    buy_price = models.DecimalField(max_digits=10,decimal_places=2)
    sale_price = models.DecimalField(max_digits=10,decimal_places=2)
    expiration_date = models.DateField(null=True, blank=True)
    date_order = models.DateField()
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    provider = models.ForeignKey(Provider, on_delete=models.PROTECT)

    def __str__(self):
        return self.product.name_product+' '+self.provider.name_provider
    
    class Meta:
        app_label = 'inventory'

@receiver(post_save, sender=Order)
def updateStock(sender, instance, **kwargs):
    product=instance.product
    if product.stock_product is None:
        product.stock_product = Decimal('0.00')
    product.stock_product += instance.quantity
    product.unit_sale_price = instance.sale_price
    product.save()