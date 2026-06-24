import { Hono } from 'hono'
import productsRoute from './routes/products'

type Bindings = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('MainStore API')
})

app.route('/products', productsRoute)

export default app
