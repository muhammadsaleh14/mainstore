import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import categoryRoutes from './routes/category/categories'
import meRoute from './routes/me'
import productRoutes from './routes/product/products'
import userRoutes from './routes/user/users'
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

app.route('/products', productRoutes)
app.route('/categories', categoryRoutes)
app.route('/users', userRoutes)
app.route('/me', meRoute)

export default app
