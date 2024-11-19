from django import forms
from ..models.product import Product
from ..models.category import Category

class ProductForm(forms.ModelForm):
    """ en las siguiente lineas obtenemos el listado de la BD, el cual lo regresa en tuplas
     luego lo pasamos a una lista e insertamos la opcion por default """
    
    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        empty_label='Seleccione una opción',
        label='Categoría',
        required=True,
        widget=forms.Select(
            attrs={
                'class': 'form-select',
            }
        ),
        error_messages={
            'required':'Seleccione una categoría',
        }
    )
    code_product = forms.CharField(
        label='Código',
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
        }
    )
    name_product = forms.CharField(
        label='Producto',
        required=True,
        min_length=5,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
            'min_length':'Debe tener mínimo 5 caracteres'
        }
    )
    description = forms.CharField(
        label='Descripción',
        min_length=5,
        required=False,
        widget=forms.Textarea(
            attrs={
                'class': 'form-control',
               ' style':'height: 100px'
            }
        )
    )
    stock_product = forms.DecimalField(
        label='Stock',
        required=False,
        min_value=0,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
        }
    )
    stock_min = forms.DecimalField(
        label='Stock Mínimo',
        required=True,
        min_value=1,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Ingrese la cantidad mínima de inventario para generar alertas',
            'min_value':'El valor mínimo aceptado es 1'
        }
    )
    unit_sale_price = forms.DecimalField(
        label='Precio',
        required=True,
        min_value=50,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
            'min_value':'El precio mínimo es 50'
        }
    )

    class Meta:
        model=Product
        fields = ['code_product','name_product','description','stock_product','stock_min','unit_sale_price','category']
        
    def clean_code_product(self):
        codeProduct = self.cleaned_data['code_product']
        instance = self.instance

        if instance.pk:
            if Product.objects.exclude(pk=instance.pk).filter(code_product = codeProduct).exists():
                raise forms.ValidationError(f'Ya existe un producto registrado con este código')
        else:
            if Product.objects.filter(code_product=codeProduct).exists():
                raise forms.ValidationError(f'Ya existe un producto registrado con este código')
        return codeProduct