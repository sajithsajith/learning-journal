from django.shortcuts import render
from django.http import HttpResponse
from second_app.models import Topic, Webpage, AccessRecord

def index(request):
    webpages_list = AccessRecord.objects.order_by('date')
    date_dict = {'access_records':webpages_list}
    return render(request, "index.html", context=date_dict)

def help(request):
    my_dict = {'fuck': 'this is the value of a variable fuck'}
    return render(request, "help.html", context=my_dict)

def my_image(request):
    my_dict = {'my_photo': 'this is me'}
    return render(request, "image_load.html", context=my_dict)
# Create your views here.
