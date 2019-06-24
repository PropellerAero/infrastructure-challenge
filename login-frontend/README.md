# OAuth2 Usage Across Micro-services

These pages demonstrate a client side OAuth2 Authorization Code Grant that any front-end code may use to gain authenticated access to a backend service.

For this example replaces the functionality of the Django authoriser.

Once done the authorized token holder is redirected to the root project page (as before) which aggregates the results of two further authorized calls and displays something like:

```html
You are logged in!

Checking that we can make authorized calls to the monolith:
200 OK: {"id": 1, "username": "root", "email": "root@user.com"}

Checking that we can make authorized calls to the microservice:
200 OK: Hello World
```

## The OAuth2 Service
The chosen OAuth2 service is Firebase Auth which makes sense if we want a fully managed product colocated with our application in GCP.




