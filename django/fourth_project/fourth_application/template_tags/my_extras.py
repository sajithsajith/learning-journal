from django import template

register = template.Library()

#@register.filter(name='cut') we can use this too instead of last one
def cut(value, arg):
    return value.replace(arg,'')

register.filter('cut',cut)