from django import forms
from ..models.client import Client

class ClientForm(forms.ModelForm):

    options_type_identification = [
        ('','Seleccione una tipo de identificación'),
        ('R.C','Registro Civil'),
        ('T.I','Tarjeta de identidad'),
        ('C.C','Cedula de ciudadanía')
    ]
    type_identification = forms.ChoiceField(
        choices=options_type_identification,
        
        label='Tipo de identificación',
        required=True,
        widget=forms.Select(
            attrs={
                'class':'form-select'
            }
        ),
        error_messages={
            'required':'Seleccione un tipo de identificación'
        }
    )
    number_identification = forms.IntegerField(
        label='Número de Identifición',
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
    first_name = forms.CharField(
        label='Primer Nombre',
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
    second_name = forms.CharField(
        label='Segundo Nombre',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )
    last_name = forms.CharField(
        label='Primer Apellido',
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
    second_last_name = forms.CharField(
        label='Segundo Apellido',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        )
    )
    phone_number = forms.CharField(
        label='Número de Teléfono',
        required=False,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        )
    )
    phone_number_aux = forms.CharField(
        label='Número de Teléfono Auxiliar',
        required=False,
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control'
            }
        )
    )
    email_address = forms.CharField(
        label='Email',
        required=False,
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    class Meta:
        model=Client
        fields = '__all__'