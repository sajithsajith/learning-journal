from django.contrib import admin

# Register your models here.
from second_app.models import AccessRecord, Topic, Webpage
admin.site.register(AccessRecord)
admin.site.register(Topic)
admin.site.register(Webpage)
