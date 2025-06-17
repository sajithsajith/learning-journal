from django.urls import re_path
from second_app import views

urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    re_path(r'^help', views.help, name='index'),
    re_path(r'^image', views.my_image, name='index'),
]
