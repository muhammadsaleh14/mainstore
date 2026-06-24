import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import adminRoute from './routes/admin'
import meRoute from './routes/me'
import productsRoute from './routes/products'
import type { Bindings } from './types/env'

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)

app.use('*', clerkMiddleware())

app.get('/', (c) => {
  return c.text('MainStore API')
})

app.route('/products', productsRoute)
app.route('/me', meRoute)
app.route('/admin', adminRoute)

export default app
