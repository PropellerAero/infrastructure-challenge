from django.http import JsonResponse, HttpResponse
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required

MICROSERVICE_ENDPOINT = 'http://microservice:3000/'

@login_required
def main_view(request):
    return TemplateResponse(request, 'main.html')


def current_user(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponse(status=401)

    return JsonResponse({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })
