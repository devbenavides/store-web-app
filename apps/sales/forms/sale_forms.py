from django import forms
from ..models.sale import Sale


class SaleForm(forms.ModelForm):
    
    code_product = forms.CharField(
        label='Codigo del producto',
        widget=forms.TextInput(
            attrs={
                'class': 'form-control'
            }
        ),
        error_messages={
            
        }
    )

    class Meta:
        model = Sale
        fields = ['code_product']
