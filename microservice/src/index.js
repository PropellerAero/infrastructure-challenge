const Koa = require('koa');
const authMiddleware = require('./oauth-middleware').authMiddleware;

const app = new Koa();

// Redirect users to the login page if they don't have a valid auth cookie
app.use(authMiddleware);

app.use(async ctx => {
    //console.log(`Authorization Token is: ${ctx.headers['authorization'] || '<missing>'}`);
    ctx.body = 'Hello World';
});

app.listen(3000, '0.0.0.0');
