FROM python:3.7
# 966MB with DJango
#FROM python:3.7-alpine
# 124MB with Django

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

CMD ./manage.py runserver 0.0.0.0:8000
