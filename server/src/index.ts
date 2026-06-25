import { clerkMiddleware } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import categoryRoutes from './routes/category/categories'
import catalogRoutes from './routes/catalog/catalog'
import checkoutRoutes from './routes/checkout/checkout'
import meRoute from './routes/me'
import orderRoutes from './routes/order/orders'
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
app.route('/catalog', catalogRoutes)
app.route('/categories', categoryRoutes)
app.route('/users', userRoutes)
app.route('/checkout', checkoutRoutes)
app.route('/orders', orderRoutes)
app.route('/me', meRoute)

export default app
