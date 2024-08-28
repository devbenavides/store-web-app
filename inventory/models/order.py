from django.db import models
from .product import Product
from .provider import Provider

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