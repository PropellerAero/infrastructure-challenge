// Server side code.
const admin = require('firebase-admin')

// This is OBVS quite a terrible thing to do.  See commit notes.
const serviceAccount = require('./service-account.json')

// The Firebase Admin SDK is used here to verify the ID token.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const getIdToken = (ctx) => {
  // Parse the injected ID token from the request header.
  const authorizationHeader = ctx.headers['authorization'] || ''
  return authorizationHeader.split(' ')[1] || ''
}

const authMiddleware = async (ctx, next) => {
  // Get ID Token
  const idToken = getIdToken(ctx)
  console.log(`idToken is: ${idToken}`);

  try {
    let decodedClaims = await admin.auth().verifyIdToken(idToken)
    console.log(`User ID Verified: ${decodedClaims['user_id']}`)
    console.log(`email: ${decodedClaims['email']}`)
  } catch (error) {
    console.log(`Error: ${error}`)
    ctx.throw(401)
  }

  await next()
}

module.exports = {
    authMiddleware
}

