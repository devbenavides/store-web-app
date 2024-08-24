from django import forms
from ..models.category import Category
from django.core import validators


class CategoryForm(forms.ModelForm):
    code_category = forms.CharField(
        label='Código',
        required=True,
        min_length=4,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
            'min_length':'Debe tener mínimo 4 caracteres.'
        }

    )
    name_category = forms.CharField(
        label='Categoría',
        required=True,
        min_length=5,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            }
        ),
        error_messages={
            'required':'Campo obligatorio',
            'min_length':'Debe tener mínimo 5 caracteres.'
        }
    )

    class Meta:
        model = Category
        fields = ['code_category', 'name_category']

    """ def clean(self):
        cleaned_data = super().clean()
        code_category = self.cleaned_data.get('code_category')
        if len(code_category) < 5:
            print('Error Tiene solo '+str(len(code_category)))
            #raise forms.ValidationError('Error de caracteres')

        return cleaned_data """
