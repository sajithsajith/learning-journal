from django import forms
from django.core import validators

#custom Validator
def check_for_s(value):
    if value[0].lower() != 's':
        raise forms.ValidationError("name needs to start with s")

class FormName(forms.Form):
    name = forms.CharField(validators=[check_for_s])
    email = forms.EmailField()
    verify_email = forms.EmailField(label="Enter your email again")
    text = forms.CharField(widget=forms.Textarea)
    botcatcher = forms.CharField(required=False,
                                 widget=forms.HiddenInput,
                                 validators=[validators.MaxLengthValidator(0)])
    
    def clean_botcatcher(self):
        botcatcher = self.cleaned_data['botcatcher']
        if len(botcatcher) > 0:
            raise forms.ValidationError("GOTCHA BOT!")
        return botcatcher
    
    #To clean all at once
    def clean(self):
        all_clean_data = super().clean()
        email = all_clean_data.get('email')
        vmail = all_clean_data.get('verify_email')
        
        if email != vmail:
            raise forms.ValidationError("Make sure the emails match!")