from django.db import models
from django.core.exceptions import ValidationError


class Provider(models.Model):
    code_provider = models.CharField(max_length=50, unique=True)
    nit_provider = models.CharField(max_length=15, unique=True)
    name_provider = models.CharField(max_length=100)
    phone_provider = models.CharField(max_length=20)
    address_provider = models.CharField(max_length=100)

    def __str__(self):
        return self.name_provider

    """ def save(self, *args, **kwargs):
            if not self.id or Provider.objects.filter(nit_provider=self.nit_provider).exclude(id=self.id).exists():
                raise ValidationError("El código ya está registrado.")
            super().save(*args, **kwargs) """

    class Meta:
        app_label = 'inventory'
