from django.shortcuts import render

# Create your views here.
from . import forms

def index(request):
    return render(request, 'index.html')

def form_name_view(request):
    form = forms.FormName(request.POST)
    # print(form.is_valid())
    if request.method == 'POST' and form.is_valid():
        
        print('VALIDATION SUCCESS')

        print('name : ',form.cleaned_data['name'])
        print('text : ',form.cleaned_data['text'])
        print('mail : ',form.cleaned_data['email'])
    return render(request, 'forms.html',{'form':form})