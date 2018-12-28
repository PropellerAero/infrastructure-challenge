# Propeller Infrastructure Challenge

This is a high level design task similar to the problems tackled by the Propeller infrastructure team. We want to see how you approach open ended design problems and what you learn from working on them.

## Background

Lil' Datum Co. is a startup that run a microservices architecture that's powered by Kubernetes. Their services perform a wide range of tasks from serving web content to performing datum transformation. Like many companies however, Lil' Datum Co. started with a monolithic architecture and have been slowly breaking parts out of it.

The way things are currently set up, a monolithic Django app handles all authentication and authorisation. After logging in with a username and password or a third party sign in button, users receive a session cookie which gives them persistent access. A reverse proxy is used to allow both the monolith and microservices to be accessed from the same domain. As such, when a user makes a request to a microservice it also receives the cookie. In order to validate that cookie and know which user it is associated with, the service must make a call to the monolith with the cookie every time it receives a request.

The upside of this approach to authentication/authorisation is that it is very easy to implement and leverages the existing capabilities of the monolith. The downsides are that:

- The request to the monolith can be slower than ideal which slows down all requests to the microservices
- In order to make a request from the monolith to one of the services on behalf of a user, the monolith must create a cookie to send with the request, which the service then must send back to the monolith for validation.
- The microservice can't make authorized requests to the monolith outside of the context of a user request.
- Lil' Datum Co. wants to be able to enable single sign on (SSO) across multiple domains and subdomains such as `*.datums.app` and `www.lildatum.co` which is not currently possible with this setup.

### Example implmentation
Included in this repository is an example implementation of this setup. It consists of a Django monolith, a Koa (NodeJS) microservice and a NGINX reverse proxy. To launch this environment you will need to [install docker](https://docs.docker.com/install/), then inside this repository's root folder, run `docker-compose up`. Navigate to `http://localhost:5000` to start using the environment.

#### The monolith
This app maintains an SQLite database that contains the user tables and session store. It also exposes a front end and an endpoint for getting the current user through the following routes:

- `/` - The main route. Renders a page with a script that contacts both the monolith and microservice to simulate a single page app. If you are logged out you will be redirected to the login page when accessing this route.
- `/login/` - The login page. Use the username `root` and password `password123` to login
- `/logout/` - The logout page. Navigating to this page logs you out.
- `/api/current_user/` - The current user endpoint. Returns a JSON payload with information about the currently logged in user. Returns a 401 response if you are not logged in.


#### The microservice
Returns `Hello World` if it can verify that you are logged in, otherwise it returns a 401 response.

#### The reverse proxy
Routes all requests to the monolith except those that start with `/microservice`. All front end requests should be made through this reverse proxy which can be accessed at `http://localhost:5000`.

To simulate accessing the services from a different domain you can also use the address `http://datumco.lcl.host:5000`. You will notice that changing domain requires you to log in again.

## The task

Your task is to re-architect the way Lil' Datum Co. handle authentication and authorisation to overcome the problems outlined above. Your solution should allow for:

- Logging in with a username/password
- Logging in with a third party (e.g google) via OAuth and/or SAML
- SSO across domains and subdomains
- Efficient checking of request authorisation for both the microservcies and the monolith
- Efficient interservice communication with the ability to easily impersonate a user from either the monolith or the microservice
- The ability to communicate between services outside the context of a request. e.g. from an asynchronous worker or cron job

You should provide a proof of concept implementation that extends the example implementation and demonstrates some or all of the above. Please provide documentation detailing how your solution works, how to set it up and any assumptions or tradeoffs that were made. A network diagram to help explain your solution will be helpful.

If you have any questions please feel free to contact keat@propelleraero.com.au
