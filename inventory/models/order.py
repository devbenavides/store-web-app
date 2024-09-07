from django.db import models
from .product import Product
from .provider import Provider
from django.db.models.signals import post_save
from django.dispatch import receiver

class Order(models.Model):
    number_invoice = models.CharField(max_length=100,null=True, blank=True)
    quantity = models.IntegerField()
    buy_price = models.IntegerField()
    sale_price = models.IntegerField()
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
    product.stock_product += instance.quantity
    product.unit_sale_price = instance.sale_price
    product.save()