from django.db import models

# Create your models here.
class Client(models.Model):
    id_client = models.BigAutoField(primary_key=True)
    type_identification = models.CharField(max_length=4)
    number_identification = models.IntegerField()
    first_name = models.CharField(max_length=30)
    second_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    second_last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=20)
    phone_number_aux = models.CharField(max_length=20)
    email_address = models.CharField(max_length=100)

    def __str__(self):
        return self.first_name

    class Meta:
        db_table = 'clients'