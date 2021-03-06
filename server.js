//TEST server setup

// const Koa = require('koa')

// const server = new Koa()

// server.use(async (ctx) => (ctx.body = 'Hello There Koa App'))

// server.listen(3000, () => console.log('Server is running on localhost: 3000'))

require('isomorphic-fetch')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const next = require('next')
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth')
const dotenv = require('dotenv')
const { verifyRequest } = require('@shopify/koa-shopify-auth')
const session = require('koa-session')
const koaBody = require('koa-body')

dotenv.config()
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy')
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env

const server = new Koa()
const router = new KoaRouter()

//mongo db for the refactor
var products = [
  {
    image1: 'test image',
  },
]

//endpoint GET request
router.get('/api/products', async (ctx) => {
  try {
    ctx.body = {
      status: 'success',
      data: products,
    }
  } catch (err) {
    console.log(error)
  }
})

//endpoint POST request
router.post('/api/products', koaBody(), async (ctx) => {
  try {
    const body = ctx.request.body
    products.push(body)
    ctx.body = 'item added'
  } catch (error) {
    console.log(error)
  }
})

//DELETE request..will reset product array
router.delete('/api/products', koaBody(), async (ctx) => {
  try {
    products = []
    ctx.body = 'all items are deleted'
  } catch (error) {
    console.log(error)
  }
})

//Router Middleware
server.use(router.allowedMethods())
server.use(router.routes())

app.prepare().then(() => {
  server.use(session({ sameSite: 'none', secure: true }, server))
  server.keys = [SHOPIFY_API_SECRET_KEY]

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        'read_products',
        'write_products',
        'read_script_tags',
        'write_script_tags',
      ],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session
        ctx.cookies.set('shopOrigin', shop, { httpOnly: false })
        ctx.redirect('/')
      },
    })
  )

  server.use(graphQLProxy({ version: ApiVersion.October19 }))
  server.use(verifyRequest())

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    ctx.res.statusCode = 200
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
