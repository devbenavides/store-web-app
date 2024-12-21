from django.db import models

# Create your models here.
class Client(models.Model):
    type_identification = models.CharField(max_length=4)
    number_identification = models.IntegerField()
    first_name = models.CharField(max_length=30)
    second_name = models.CharField(max_length=30,blank=True,null=True)
    last_name = models.CharField(max_length=30)
    second_last_name = models.CharField(max_length=30,blank=True,null=True)
    phone_number = models.CharField(max_length=20,blank=True,null=True)
    phone_number_aux = models.CharField(max_length=20,blank=True,null=True)
    email_address = models.CharField(max_length=100,blank=True,null=True)

    def __str__(self):
        return self.first_name

    class Meta:
        db_table = 'clients'