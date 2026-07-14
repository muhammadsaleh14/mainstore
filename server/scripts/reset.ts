import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.dev.vars' })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL not found in .dev.vars')
  process.exit(1)
}

async function reset() {
  const client = new pg.Client({ connectionString: databaseUrl })
  await client.connect()

  console.log('Dropping all tables...')
  await client.query('DROP TABLE IF EXISTS order_items CASCADE')
  await client.query('DROP TABLE IF EXISTS orders CASCADE')
  await client.query('DROP TABLE IF EXISTS product_variants CASCADE')
  await client.query('DROP TABLE IF EXISTS products CASCADE')
  await client.query('DROP TABLE IF EXISTS categories CASCADE')
  await client.query('DROP TABLE IF EXISTS users CASCADE')

  console.log('Dropping enums...')
  await client.query('DROP TYPE IF EXISTS role CASCADE')
  await client.query('DROP TYPE IF EXISTS product_status CASCADE')
  await client.query('DROP TYPE IF EXISTS order_status CASCADE')
  await client.query('DROP TYPE IF EXISTS payment_status CASCADE')

  // Drop drizzle meta table too
  await client.query('DROP TABLE IF EXISTS __drizzle_migrations CASCADE')

  console.log('Applying migrations...')
  const migrationsDir = resolve(process.cwd(), 'drizzle')
  const journal = JSON.parse(
    readFileSync(join(migrationsDir, 'meta', '_journal.json'), 'utf-8'),
  )

  for (const entry of journal.entries) {
    const filePath = join(migrationsDir, `${entry.tag}.sql`)
    const content = readFileSync(filePath, 'utf-8')
    const statements = content
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(Boolean)

    for (const stmt of statements) {
      await client.query(stmt)
    }

    console.log(`  ${entry.tag} applied`)
  }

  await client.end()
  console.log('Reset and migrations complete.')
}

reset().catch((err) => {
  console.error('Reset failed:', err)
  process.exit(1)
})
