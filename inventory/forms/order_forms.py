from django import forms
from django.utils import timezone
from ..models.order import Order
from ..models.product import Product
from ..models.provider import Provider


class OrderForm(forms.ModelForm):
    product = forms.ModelChoiceField(
        queryset=Product.objects.all(),
        empty_label='Seleccione una opción',
        label='Producto',
        required=True,
        widget=forms.Select(
            attrs={
                'class': 'form-select',
            }
        ),
        error_messages={
            'required': 'Seleccione una categoría',
        }
    )

    provider = forms.ModelChoiceField(
        queryset=Provider.objects.all(),
        empty_label='Seleccione una opción',
        label='Proveedor',
        required=True,
        widget=forms.Select(
            attrs={
                'class': 'form-select',
            }
        ),
        error_messages={
            'required': 'Seleccione una proveedor',
        }
    )

    number_invoice = forms.CharField(
        label='Número de factura',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={

        }
    )
    quantity = forms.DecimalField(
        label='Cantidad',
        required=True,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    buy_price = forms.DecimalField(
        label='Precio de compra',
        required=True,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    sale_price = forms.DecimalField(
        label='Precio de venta',
        required=True,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    code_product = forms.CharField(
        label='Codigo del producto',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder':'Escanee o digite el codigo del producto',
                'aria-describedby':'basic-addon3 basic-addon4'
            }
        ),
    )
    expiration_date = forms.DateField(
        label='Fecha de vencimiento',
        required=False,
        widget=forms.DateInput(
            attrs={
                'class': 'form-control',
                'type': 'date'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    date_order = forms.DateField(
        label='Fecha del pedido',
        required=True,
        widget=forms.DateInput(
            attrs={
                'class': 'form-control',
                'type': 'date'
            }
        ),
        error_messages={
            'required': 'Fecha obligatoria'
        }
    )

    class Meta:
        model = Order
        fields = '__all__'

    def clean_date_order(self):
        date_order =  self.cleaned_data.get('date_order')
        today = timezone.now().date()

        if(date_order>today):
            raise forms.ValidationError('La fecha no puede ser mayor que la fecha actual.')
        return date_order
    
    def __init__(self, *args, **kwargs):
        instance = kwargs.get('instance', None)
        super().__init__(*args, **kwargs)

        if instance:
            for field_name in ['date_order','expiration_date']:
                field_value=getattr(instance,field_name)
                if field_name:
                    self.initial[field_name] = field_value.strftime('%Y-%m-%d')
