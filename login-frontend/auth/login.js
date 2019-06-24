/* Following OAuth Provider guide
 * https://firebase.google.com/docs/auth/web/firebaseui
 * */

window.onload = () => {
  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyBM1ocCU-L5mCEe1eX9Ix1bYX6x79oZnJM",
    authDomain: "total-method-208705.firebaseapp.com",
    databaseURL: "https://total-method-208705.firebaseio.com",
    projectId: "total-method-208705",
    storageBucket: "",
    messagingSenderId: "532089400396",
    appId: "1:532089400396:web:37036522f63be838"
  }

  // This is passed into the backend to authenticate the user.
  let userIdToken = null

  const hide = (element) => {
    element.style.display = "none"
  }

  const show = (element) => {
    element.style.display = "block"
  }

  // Firebase log-in
  const configureFirebaseLogin = () => {
    firebase.initializeApp(config)
    let logged_out = document.getElementById("logged-out")
    let logged_in = document.getElementById("logged-in")

    // Change page on auth events
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        hide(logged_out)

        let name = user.displayName

        /* If the provider gives a display name, use the name for the
        personal welcome message. Otherwise, use the user's email. */
        let welcomeName = name ? name : user.email

        try {
          userIdToken = await user.getIdToken()
          console.log(`Successfully got idToken: ${userIdToken}`)
          document.getElementById('user').innerHTML = welcomeName
          show(logged_in)
        } catch (e) {
          console.log(`Error getting idToken: ${e}`)
        }
      } else {
        hide(logged_in)
        show(logged_out)
      }
    })
  }

  // Configure the drop-in
  const configureFirebaseLoginWidget = () => {
    let uiConfig = {
      'signInSuccessUrl': '/auth/login.html',
      'signInOptions': [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url
      //'tosUrl': '<your-tos-url>',
    }

    let ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  // Sign out a user
  let signOutBtn = document.getElementById('sign-out')
  signOutBtn.addEventListener('click', async (event) => {
    event.preventDefault()

    try {
      await firebase.auth().signOut()
      console.log("Sign out successful")
    } catch (e) {
      console.log(e)
    }
  })

  configureFirebaseLogin()
  configureFirebaseLoginWidget()
}
