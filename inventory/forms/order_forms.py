from django import forms
from ..models.order import Order
from ..models.product import Product
from ..models.provider import Provider


class ProductForm(forms.ModelForm):
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
    quantity = forms.IntegerField(
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
    buy_price = forms.IntegerField(
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
    sale_price = forms.IntegerField(
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
    expiration_date = forms.DateField(
        label='Fecha de vencimiento',
        input_formats=['%Y-%m-%d'],
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
        input_formats=['%Y-%m-%d'],
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
