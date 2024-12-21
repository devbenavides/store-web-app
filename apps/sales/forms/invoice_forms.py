from django import forms
from ..models.invoice import Invoice


class InvoiceForm(forms.ModelForm):

    id_client = forms.IntegerField(
        label='Numero de Identificion del Cliente',
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
    code_invoice = forms.CharField(
        label='Número de Factura',
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )

    options_payment = [
        ('cash', 'Efectivo'),
        ('card', 'Tarjeta')
    ]
    payment_method = forms.ChoiceField(
        choices=options_payment,
        initial='cash',
        label='Medio de pago',
        required=True,
        widget=forms.Select(
            attrs={
                'class': 'form-select'
            }
        ),
        error_messages={
            'required': 'Seleccione un metodo de pago'
        }
    )

    total_invoice = forms.DecimalField(
        label='Total',
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    cash_received = forms.DecimalField(
        label='Efectivo recibido',
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    cash_change = forms.DecimalField(
        label='Cambio',
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    date_invoice = forms.DateTimeField(
        label='Fecha',
        required=True,
        widget=forms.DateTimeInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )

    class Meta:
        model = Invoice
        fields = '__all__'
