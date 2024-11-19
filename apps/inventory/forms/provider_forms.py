from django import forms
from ..models.provider import Provider


class ProviderForm(forms.ModelForm):
    code_provider = forms.CharField(
        label='Código',
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
    nit_provider = forms.IntegerField(
        label='NIT',
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
    name_provider = forms.CharField(
        label='Nombre',
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
    phone_provider = forms.CharField(
        label='Número de Teléfono',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )
    address_provider = forms.CharField(
        label='Dirección',
        required=False,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            'required': 'Campo obligatorio'
        }
    )

    class Meta:
        model = Provider
        fields = '__all__'

    def clean_nit_provider(self):
        nit_provider = self.cleaned_data['nit_provider']
        instance = self.instance

        if instance and instance.nit_provider == nit_provider:
            return nit_provider

        provider_exists = Provider.objects.filter(
            nit_provider=nit_provider).exclude(id=instance.id).exists()

        if provider_exists:
            raise forms.ValidationError(
                "Ya existe un proveedor registrado con este NIT")
        return nit_provider
