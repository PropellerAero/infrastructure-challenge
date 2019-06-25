from django.http import JsonResponse, HttpResponse
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
import firebase_admin
from firebase_admin import auth
import os

MICROSERVICE_ENDPOINT = 'http://microservice:3000/'


@login_required
def main_view(request):
    return TemplateResponse(request, 'main.html')


def current_user(request):

    ## 1. Get Service creds
    here = os.path.dirname(os.path.realpath(__file__))
    service_creds_file = os.path.join(here, 'service-account.json')
    default_app = firebase_admin.initialize_app(
        credential=firebase_admin.credentials.Certificate(service_creds_file)
    )

    ## 2. Get ID Token in Header
    id_token = request.META['HTTP_AUTHORIZATION'].split(' ')[1]

    ## 3. Check it with Auth service
    try:
        decoded_token = auth.verify_id_token(id_token)
        return JsonResponse({
            'id': decoded_token["user_id"],
            'username': decoded_token.get('username', None),
            'email': decoded_token["email"],
        })
    except Exception as e:
        print(f"Invalid id token: {e}")
        return HttpResponse(status=401)
