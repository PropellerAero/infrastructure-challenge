importScripts("https://www.gstatic.com/firebasejs/6.2.2/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/6.2.2/firebase-auth.js")
importScripts("/firebase-app-config.js")


// Initialize the Firebase app in the service worker script.
firebase.initializeApp(config)

const getIdToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe()
      if (user) {
        user.getIdToken().then((idToken) => {
          resolve(idToken)
        }, (error) => {
          resolve(null)
        })
      } else {
        resolve(null)
      }
    })
  })
}


const getHostFromUrl = (url) => {
  const pathArray = url.split('/')
  const protocol = pathArray[0]
  const [host, ...rest] = pathArray[2].split(':')
  return host
}

// Intercept fetch events
self.addEventListener('fetch', (event) => {
  const requestProcessor = (idToken) => {
    let req = event.request

    // For same approved internal sites, append idToken to header.
    let internal_domains = [
      'datum.lcl.host',
      'datumco.lcl.host',
      'localhost',
      // Add deployed Domains here
    ]

    if (internal_domains.includes(getHostFromUrl(req.url)) &&
        (self.location.protocol == 'https:' ||
         self.location.hostname == 'localhost') &&
        idToken) {

      // Clone headers
      const headers = new Headers()
      for (let entry of req.headers.entries()) {
        headers.append(entry[0], entry[1])
      }

      // Add ID token to header.
      headers.append('Authorization', 'Bearer ' + idToken)

      // Find /microservice call
      if (req.url.includes('microservice')) {
        console.log(`fetching from microservice (${req.url})`)
      }

      try {
        req = new Request(req.url, {
          method: req.method,
          headers: headers,
          mode: 'same-origin',
          credentials: req.credentials,
          cache: req.cache,
          redirect: req.redirect,
          referrer: req.referrer,
          body: req.body,
          bodyUsed: req.bodyUsed,
          context: req.context
        })
      } catch (e) {
        // This will fail for CORS requests. We just continue with the
        // fetch caching logic below and do not pass the ID token.
      }
    }
    return fetch(req)
  }
  // Fetch the resource after checking for the ID token.
  event.respondWith(
    getIdToken()
    .then(requestProcessor, requestProcessor)
  )
})

// Activate the service worker on current page
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

