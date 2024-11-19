from django import forms
from ..models.sale import Sale


class SaleForm(forms.ModelForm):

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

    sales_price = forms.DecimalField(
        label='Precio de venta',
        required=True,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio',
        }
    )
    
    code_product = forms.CharField(
        label='Codigo del producto',
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio',
        }
    )

    class Meta:
        model = Sale
        fields = ['quantity','sales_price','code_product']
