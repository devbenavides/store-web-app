from django.db import models
from django.core.exceptions import ValidationError
from .category import Category


# Create your models here.


class Product(models.Model):
    code_product = models.CharField(max_length=50, unique=True)
    name_product = models.CharField(max_length=30)
    description = models.CharField(max_length=255, null=True, blank=True)
    stock_product = models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True)
    stock_min = models.DecimalField(max_digits=10,decimal_places=2)
    unit_sale_price = models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True)
    image_product = models.CharField(max_length=50, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name_product+' '+self.category.name_category

    class Meta:
        app_label = 'inventory'

