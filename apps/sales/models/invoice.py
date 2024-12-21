from django.db import models
from apps.clients.models.client import Client

class Invoice(models.Model):
    code_invoice = models.CharField(max_length=100, unique=True)
    payment_method = models.CharField(max_length=30)
    total_invoice = models.DecimalField(max_digits=15, decimal_places=2)
    cash_received = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    cash_change = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    date_invoice = models.DateTimeField(auto_now_add=True)
    client = models.ForeignKey(Client, on_delete=models.RESTRICT)

    def __str__(self):
        return self.code

    class Meta:
        db_table = 'invoices'