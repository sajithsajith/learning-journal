from django.shortcuts import render

# Create your views here.
def index(request):
    context_dict = {'text':'hello world', 'number':100}
    return render(request, 'fourth_application/index.html', context_dict)

def other(request):
    return render(request, 'fourth_application/other.html')

def relative(request):
    return render(request, 'fourth_application/relative_url_templates.html')