from django.db import models

# Create your models here.


class Category(models.Model):
    #id_category = models.BigAutoField(primary_key=True)
    code_category = models.CharField(max_length=20)
    name_category = models.CharField(max_length=30)

    def __str__(self):
        return self.name_category
    
    """ convertir texto a mayusculas antes de guardar """
    """ def save(self, *args, **kwargs):
        self.code_category = self.code_category.upper()
        return super(Category, self).save(*args, **kwargs)
     """
    """ @staticmethod
    def get_category_choices():
        return [(category.id, category.name_category) for category in Category.objects.all()]
    
    @staticmethod
    def get_choices():
        choices = [(None, '---------')]  # Opción vacía al principio
        categories = Category.objects.all()
        choices += [(category.id, category.name_category) for category in categories]
        return choices """
    
    class Meta:
        app_label='inventory'
