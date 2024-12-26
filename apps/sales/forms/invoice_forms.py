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
    cash_received = forms.DecimalField(
        label='Efectivo recibido',
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

    class Meta:
        model = Invoice
        fields = ['id_client','payment_method','cash_received']
