import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/db/schema/index'
import { slugify } from '../src/utils/slugify'

config({ path: '.dev.vars' })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL not found in .dev.vars')
  process.exit(1)
}

const sql = neon(databaseUrl)
const db = drizzle(sql, { schema })

async function seed() {
  console.log('Seeding database...')

  // Clean existing data in reverse FK order
  await db.delete(schema.orderItems)
  await db.delete(schema.orders)
  await db.delete(schema.productVariants)
  await db.delete(schema.products)
  await db.delete(schema.categories)
  await db.delete(schema.users)

  // ── Users ──────────────────────────────────────────────
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      clerkId: 'user_2_admin_placeholder',
      email: 'admin@mainstore.com',
      role: 'admin',
    })
    .returning()

  const [managerUser] = await db
    .insert(schema.users)
    .values({
      clerkId: 'user_2_manager_placeholder',
      email: 'manager@mainstore.com',
      role: 'manager',
    })
    .returning()

  const [customerUser] = await db
    .insert(schema.users)
    .values({
      clerkId: 'user_2_customer_placeholder',
      email: 'customer@example.com',
      role: 'customer',
    })
    .returning()

  console.log(`  Users: ${3} inserted`)

  // ── Categories ─────────────────────────────────────────
  const catData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    { name: 'Books & Media', slug: 'books-media' },
  ]

  const categories = await db
    .insert(schema.categories)
    .values(catData)
    .returning()

  const catMap: Record<string, typeof categories[number]> = {}
  for (const c of categories) {
    catMap[c.slug] = c
  }

  // Subcategories
  const subcatData = [
    { name: 'Smartphones', slug: 'smartphones', parentId: catMap['electronics'].id },
    { name: 'Laptops', slug: 'laptops', parentId: catMap['electronics'].id },
    { name: 'Headphones', slug: 'headphones', parentId: catMap['electronics'].id },
    { name: "Men's Clothing", slug: 'mens-clothing', parentId: catMap['clothing'].id },
    { name: "Women's Clothing", slug: 'womens-clothing', parentId: catMap['clothing'].id },
    { name: 'Furniture', slug: 'furniture', parentId: catMap['home-garden'].id },
    { name: 'Kitchenware', slug: 'kitchenware', parentId: catMap['home-garden'].id },
    { name: 'Fitness', slug: 'fitness', parentId: catMap['sports-outdoors'].id },
    { name: 'Camping', slug: 'camping', parentId: catMap['sports-outdoors'].id },
    { name: 'Fiction Books', slug: 'fiction-books', parentId: catMap['books-media'].id },
    { name: 'Non-Fiction Books', slug: 'non-fiction-books', parentId: catMap['books-media'].id },
  ]

  const subcategories = await db
    .insert(schema.categories)
    .values(subcatData)
    .returning()

  for (const c of subcategories) {
    catMap[c.slug] = c
  }

  const allCategories = [...categories, ...subcategories]
  console.log(`  Categories: ${allCategories.length} inserted`)

  // ── Products ───────────────────────────────────────────
  const productsData = [
    {
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      description: 'The latest Apple iPhone with A18 Pro chip, 48MP camera system, and titanium design.',
      status: 'enabled' as const,
      categoryId: catMap['smartphones'].id,
    },
    {
      name: 'Samsung Galaxy S25 Ultra',
      slug: 'samsung-galaxy-s25-ultra',
      description: 'Premium Android flagship with built-in S Pen, 200MP camera, and Galaxy AI features.',
      status: 'enabled' as const,
      categoryId: catMap['smartphones'].id,
    },
    {
      name: 'MacBook Pro 16" M4',
      slug: 'macbook-pro-16-m4',
      description: 'Apple M4 chip with 16-core CPU, 40-core GPU, 48GB unified memory, and 22-hour battery life.',
      status: 'enabled' as const,
      categoryId: catMap['laptops'].id,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Ultra-thin laptop with Intel Core Ultra 9, 32GB RAM, OLED touch display.',
      status: 'enabled' as const,
      categoryId: catMap['laptops'].id,
    },
    {
      name: 'Sony WH-1000XM6 Wireless Headphones',
      slug: 'sony-wh-1000xm6',
      description: 'Industry-leading noise cancellation with 40-hour battery life and Hi-Res Audio.',
      status: 'enabled' as const,
      categoryId: catMap['headphones'].id,
    },
    {
      name: 'AirPods Pro 3',
      slug: 'airpods-pro-3',
      description: 'Adaptive audio, active noise cancellation, and USB-C MagSafe charging case.',
      status: 'enabled' as const,
      categoryId: catMap['headphones'].id,
    },
    {
      name: 'Classic Fit Cotton T-Shirt',
      slug: 'classic-fit-cotton-tshirt',
      description: 'Premium 100% organic cotton t-shirt. Pre-shrunk, double-stitched, and available in multiple colors.',
      status: 'enabled' as const,
      categoryId: catMap['mens-clothing'].id,
    },
    {
      name: 'Slim Fit Chinos',
      slug: 'slim-fit-chinos',
      description: 'Stretch cotton chino pants with a modern slim fit. Wrinkle-resistant and machine washable.',
      status: 'enabled' as const,
      categoryId: catMap['mens-clothing'].id,
    },
    {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description: 'Lightweight breathable fabric with a beautiful floral print. Mid-length with adjustable straps.',
      status: 'enabled' as const,
      categoryId: catMap['womens-clothing'].id,
    },
    {
      name: 'Wool Blend Blazer',
      slug: 'wool-blend-blazer',
      description: 'Tailored fit blazer in premium wool blend. Perfect for office or formal occasions.',
      status: 'enabled' as const,
      categoryId: catMap['womens-clothing'].id,
    },
    {
      name: 'Nordic Minimalist Desk',
      slug: 'nordic-minimalist-desk',
      description: 'Solid oak desk with clean lines and cable management. 140cm width, fits any home office.',
      status: 'enabled' as const,
      categoryId: catMap['furniture'].id,
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Adjustable lumbar support, breathable mesh back, 4D armrests, and tilt mechanism.',
      status: 'enabled' as const,
      categoryId: catMap['furniture'].id,
    },
    {
      name: 'Stainless Steel Cookware Set',
      slug: 'stainless-steel-cookware-set',
      description: '10-piece tri-ply stainless steel set. Oven safe to 500°F. Dishwasher safe.',
      status: 'enabled' as const,
      categoryId: catMap['kitchenware'].id,
    },
    {
      name: 'Ceramic Knife Set',
      slug: 'ceramic-knife-set',
      description: '6-piece ceramic knife set with ergonomic handles. Ultra-sharp, rust-proof, and lightweight.',
      status: 'enabled' as const,
      categoryId: catMap['kitchenware'].id,
    },
    {
      name: 'Smart Fitness Watch Pro',
      slug: 'smart-fitness-watch-pro',
      description: 'GPS sports watch with heart rate monitoring, SpO2 tracking, sleep analysis, and 14-day battery.',
      status: 'enabled' as const,
      categoryId: catMap['fitness'].id,
    },
    {
      name: 'Adjustable Dumbbell Set',
      slug: 'adjustable-dumbbell-set',
      description: 'Space-saving adjustable dumbbells from 5-52.5 lbs each. Quick-change weight system.',
      status: 'enabled' as const,
      categoryId: catMap['fitness'].id,
    },
    {
      name: '4-Person Camping Tent',
      slug: '4-person-camping-tent',
      description: 'Waterproof 3-season tent with easy setup. Includes rainfly, footprint, and carry bag.',
      status: 'enabled' as const,
      categoryId: catMap['camping'].id,
    },
    {
      name: 'Portable Camping Stove',
      slug: 'portable-camping-stove',
      description: 'Compact propane stove with 10,000 BTU output. Windscreen included. Boils water in 3 minutes.',
      status: 'enabled' as const,
      categoryId: catMap['camping'].id,
    },
    {
      name: 'The Art of Clean Code',
      slug: 'the-art-of-clean-code',
      description: 'A practical guide to writing maintainable, scalable software. Covers patterns, refactoring, and testing.',
      status: 'enabled' as const,
      categoryId: catMap['fiction-books'].id,
    },
    {
      name: 'Atomic Habits',
      slug: 'atomic-habits',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller.',
      status: 'enabled' as const,
      categoryId: catMap['non-fiction-books'].id,
    },
    {
      name: 'Wireless Charging Pad',
      slug: 'wireless-charging-pad',
      description: '15W fast wireless charger compatible with all Qi devices. Slim design with LED indicator.',
      status: 'enabled' as const,
      categoryId: catMap['electronics'].id,
    },
    {
      name: 'Bluetooth Speaker Mini',
      slug: 'bluetooth-speaker-mini',
      description: 'Portable waterproof speaker with 360° sound. 20-hour battery life. IP67 rated.',
      status: 'enabled' as const,
      categoryId: catMap['electronics'].id,
    },
  ]

  const products = await db
    .insert(schema.products)
    .values(productsData)
    .returning()

  console.log(`  Products: ${products.length} inserted`)

  // ── Product Variants ───────────────────────────────────
  const variantsData: (typeof schema.newProductVariant)[] = []

  for (const product of products) {
    switch (product.slug) {
      case 'iphone-16-pro-max':
        variantsData.push(
          { productId: product.id, sku: 'IP16PM-256', price: '1199.00', stockQuantity: 25, isDefault: true, barcode: '194253398765', weightGrams: 227 },
          { productId: product.id, sku: 'IP16PM-512', price: '1399.00', stockQuantity: 15, isDefault: false, barcode: '194253398772', weightGrams: 227 },
          { productId: product.id, sku: 'IP16PM-1TB', price: '1599.00', stockQuantity: 10, isDefault: false, barcode: '194253398789', weightGrams: 227 },
        )
        break
      case 'samsung-galaxy-s25-ultra':
        variantsData.push(
          { productId: product.id, sku: 'S25U-256', price: '1099.00', stockQuantity: 30, isDefault: true, barcode: '880609512345', weightGrams: 219 },
          { productId: product.id, sku: 'S25U-512', price: '1299.00', stockQuantity: 20, isDefault: false, barcode: '880609512352', weightGrams: 219 },
        )
        break
      case 'macbook-pro-16-m4':
        variantsData.push(
          { productId: product.id, sku: 'MBP16-M4-36', price: '2499.00', stockQuantity: 10, isDefault: true, barcode: '194253499001', weightGrams: 2140 },
          { productId: product.id, sku: 'MBP16-M4-48', price: '2899.00', stockQuantity: 8, isDefault: false, barcode: '194253499018', weightGrams: 2140 },
        )
        break
      case 'dell-xps-15':
        variantsData.push(
          { productId: product.id, sku: 'XPS15-U9-32', price: '1899.00', stockQuantity: 12, isDefault: true, barcode: '884116456789', weightGrams: 1800 },
          { productId: product.id, sku: 'XPS15-U9-64', price: '2199.00', stockQuantity: 6, isDefault: false, barcode: '884116456796', weightGrams: 1800 },
        )
        break
      case 'sony-wh-1000xm6':
        variantsData.push(
          { productId: product.id, sku: 'WH1000XM6-BLK', price: '349.99', stockQuantity: 40, isDefault: true, barcode: '027242923456', weightGrams: 250 },
          { productId: product.id, sku: 'WH1000XM6-SIL', price: '349.99', stockQuantity: 25, isDefault: false, barcode: '027242923463', weightGrams: 250 },
        )
        break
      case 'airpods-pro-3':
        variantsData.push(
          { productId: product.id, sku: 'APP3-USB', price: '249.00', stockQuantity: 50, isDefault: true, barcode: '194253398888', weightGrams: 54 },
        )
        break
      case 'classic-fit-cotton-tshirt':
        variantsData.push(
          { productId: product.id, sku: 'TEE-WHT-S', price: '29.99', stockQuantity: 100, isDefault: true, barcode: '880987654321', weightGrams: 150 },
          { productId: product.id, sku: 'TEE-WHT-M', price: '29.99', stockQuantity: 150, isDefault: false, barcode: '880987654338', weightGrams: 160 },
          { productId: product.id, sku: 'TEE-WHT-L', price: '29.99', stockQuantity: 120, isDefault: false, barcode: '880987654345', weightGrams: 175 },
          { productId: product.id, sku: 'TEE-BLK-M', price: '32.99', stockQuantity: 80, isDefault: false, barcode: '880987654352', weightGrams: 160 },
          { productId: product.id, sku: 'TEE-BLK-L', price: '32.99', stockQuantity: 90, isDefault: false, barcode: '880987654369', weightGrams: 175 },
        )
        break
      case 'slim-fit-chinos':
        variantsData.push(
          { productId: product.id, sku: 'CHINO-KHK-32', price: '59.99', stockQuantity: 40, isDefault: true, barcode: '880987654376', weightGrams: 400 },
          { productId: product.id, sku: 'CHINO-KHK-34', price: '59.99', stockQuantity: 45, isDefault: false, barcode: '880987654383', weightGrams: 420 },
          { productId: product.id, sku: 'CHINO-NAV-32', price: '59.99', stockQuantity: 35, isDefault: false, barcode: '880987654390', weightGrams: 400 },
        )
        break
      case 'floral-summer-dress':
        variantsData.push(
          { productId: product.id, sku: 'FSD-S', price: '49.99', stockQuantity: 30, isDefault: true, barcode: '880987654406', weightGrams: 200 },
          { productId: product.id, sku: 'FSD-M', price: '49.99', stockQuantity: 45, isDefault: false, barcode: '880987654413', weightGrams: 220 },
          { productId: product.id, sku: 'FSD-L', price: '49.99', stockQuantity: 35, isDefault: false, barcode: '880987654420', weightGrams: 240 },
        )
        break
      case 'wool-blend-blazer':
        variantsData.push(
          { productId: product.id, sku: 'WBBLZ-S', price: '149.99', stockQuantity: 15, isDefault: true, barcode: '880987654437', weightGrams: 600 },
          { productId: product.id, sku: 'WBBLZ-M', price: '149.99', stockQuantity: 20, isDefault: false, barcode: '880987654444', weightGrams: 650 },
          { productId: product.id, sku: 'WBBLZ-L', price: '149.99', stockQuantity: 18, isDefault: false, barcode: '880987654451', weightGrams: 700 },
        )
        break
      case 'nordic-minimalist-desk':
        variantsData.push(
          { productId: product.id, sku: 'DESK-OAK', price: '449.99', stockQuantity: 10, isDefault: true, barcode: '880987654468', weightGrams: 25000 },
          { productId: product.id, sku: 'DESK-WALNUT', price: '499.99', stockQuantity: 8, isDefault: false, barcode: '880987654475', weightGrams: 26000 },
        )
        break
      case 'ergonomic-office-chair':
        variantsData.push(
          { productId: product.id, sku: 'CHAIR-BLK', price: '399.99', stockQuantity: 15, isDefault: true, barcode: '880987654482', weightGrams: 15000 },
          { productId: product.id, sku: 'CHAIR-GRY', price: '399.99', stockQuantity: 10, isDefault: false, barcode: '880987654499', weightGrams: 15000 },
        )
        break
      case 'stainless-steel-cookware-set':
        variantsData.push(
          { productId: product.id, sku: 'COOK-10PC', price: '299.99', stockQuantity: 20, isDefault: true, barcode: '880987654505', weightGrams: 8000 },
        )
        break
      case 'ceramic-knife-set':
        variantsData.push(
          { productId: product.id, sku: 'KNIFE-6PC', price: '79.99', stockQuantity: 35, isDefault: true, barcode: '880987654512', weightGrams: 900 },
        )
        break
      case 'smart-fitness-watch-pro':
        variantsData.push(
          { productId: product.id, sku: 'SFW-BLK', price: '199.99', stockQuantity: 30, isDefault: true, barcode: '880987654529', weightGrams: 60 },
          { productId: product.id, sku: 'SFW-WHT', price: '199.99', stockQuantity: 25, isDefault: false, barcode: '880987654536', weightGrams: 60 },
        )
        break
      case 'adjustable-dumbbell-set':
        variantsData.push(
          { productId: product.id, sku: 'DUMB-5-52', price: '349.99', stockQuantity: 12, isDefault: true, barcode: '880987654543', weightGrams: 24000 },
        )
        break
      case '4-person-camping-tent':
        variantsData.push(
          { productId: product.id, sku: 'TENT-4P', price: '249.99', stockQuantity: 15, isDefault: true, barcode: '880987654550', weightGrams: 4500 },
        )
        break
      case 'portable-camping-stove':
        variantsData.push(
          { productId: product.id, sku: 'STOVE-PRO', price: '39.99', stockQuantity: 50, isDefault: true, barcode: '880987654567', weightGrams: 350 },
        )
        break
      case 'the-art-of-clean-code':
        variantsData.push(
          { productId: product.id, sku: 'BOOK-CLEANCODE', price: '34.99', stockQuantity: 100, isDefault: true, barcode: '9780132350884', weightGrams: 400 },
        )
        break
      case 'atomic-habits':
        variantsData.push(
          { productId: product.id, sku: 'BOOK-ATHABITS', price: '16.99', stockQuantity: 200, isDefault: true, barcode: '9780735211292', weightGrams: 350 },
        )
        break
      case 'wireless-charging-pad':
        variantsData.push(
          { productId: product.id, sku: 'WCP-15W', price: '24.99', stockQuantity: 100, isDefault: true, barcode: '880987654574', weightGrams: 80 },
        )
        break
      case 'bluetooth-speaker-mini':
        variantsData.push(
          { productId: product.id, sku: 'SPKR-BLK', price: '39.99', stockQuantity: 60, isDefault: true, barcode: '880987654581', weightGrams: 200 },
          { productId: product.id, sku: 'SPKR-BLU', price: '39.99', stockQuantity: 40, isDefault: false, barcode: '880987654598', weightGrams: 200 },
        )
        break
      default:
        variantsData.push(
          { productId: product.id, sku: `${product.slug.toUpperCase().replace(/-/g, '_')}-DFLT`, price: '49.99', stockQuantity: 25, isDefault: true, barcode: `000000000${product.id}`.padStart(12, '0'), weightGrams: 500 },
        )
    }
  }

  const variants = await db
    .insert(schema.productVariants)
    .values(variantsData)
    .returning()

  console.log(`  Product Variants: ${variants.length} inserted`)

  // ── Orders ─────────────────────────────────────────────
  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)

  const ordersData = [
    {
      userId: customerUser.id,
      status: 'delivered' as const,
      paymentStatus: 'paid' as const,
      subtotal: '1298.99',
      shippingTotal: '10.00',
      total: '1308.99',
      shippingAddress: {
        fullName: 'Ahmed Al-Rashid',
        line1: '789 King Fahd Road',
        line2: 'Apt 4B',
        city: 'Riyadh',
        state: 'Riyadh Province',
        postalCode: '11564',
        country: 'SA',
        phone: '+966501234567',
      },
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
    {
      userId: customerUser.id,
      status: 'shipped' as const,
      paymentStatus: 'paid' as const,
      subtotal: '89.98',
      shippingTotal: '10.00',
      total: '99.98',
      shippingAddress: {
        fullName: 'Ahmed Al-Rashid',
        line1: '789 King Fahd Road',
        line2: 'Apt 4B',
        city: 'Riyadh',
        state: 'Riyadh Province',
        postalCode: '11564',
        country: 'SA',
        phone: '+966501234567',
      },
      createdAt: daysAgo(1),
      updatedAt: daysAgo(0),
    },
    {
      userId: customerUser.id,
      status: 'pending_payment' as const,
      paymentStatus: 'pending' as const,
      subtotal: '449.99',
      shippingTotal: '0.00',
      total: '449.99',
      shippingAddress: {
        fullName: 'Ahmed Al-Rashid',
        line1: '789 King Fahd Road',
        line2: 'Apt 4B',
        city: 'Riyadh',
        state: 'Riyadh Province',
        postalCode: '11564',
        country: 'SA',
        phone: '+966501234567',
      },
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ]

  const orders = await db
    .insert(schema.orders)
    .values(ordersData)
    .returning()

  console.log(`  Orders: ${orders.length} inserted`)

  // ── Order Items ────────────────────────────────────────
  const iphoneVariants = variants.filter(v => v.sku.startsWith('IP16PM'))
  const tshirtVariants = variants.filter(v => v.sku.startsWith('TEE-'))
  const airpodsVariant = variants.find(v => v.sku === 'APP3-USB')!
  const deskVariant = variants.find(v => v.sku === 'DESK-OAK')!
  const bookAtomic = variants.find(v => v.sku === 'BOOK-ATHABITS')!
  const chargerVariant = variants.find(v => v.sku === 'WCP-15W')!

  const orderItemsData = [
    // Order 1: iPhone 16 Pro Max 256GB + T-shirt + AirPods
    { orderId: orders[0].id, productId: products.find(p => p.slug === 'iphone-16-pro-max')!.id, variantId: iphoneVariants.find(v => v.isDefault)!.id, productName: 'iPhone 16 Pro Max', variantSku: iphoneVariants.find(v => v.isDefault)!.sku, unitPrice: '1199.00', quantity: 1 },
    { orderId: orders[0].id, productId: products.find(p => p.slug === 'classic-fit-cotton-tshirt')!.id, variantId: tshirtVariants.find(v => v.sku === 'TEE-WHT-M')!.id, productName: 'Classic Fit Cotton T-Shirt', variantSku: 'TEE-WHT-M', unitPrice: '29.99', quantity: 2 },
    { orderId: orders[0].id, productId: products.find(p => p.slug === 'airpods-pro-3')!.id, variantId: airpodsVariant.id, productName: 'AirPods Pro 3', variantSku: 'APP3-USB', unitPrice: '249.00', quantity: 1 },
    // Order 2: Atomic Habits + Wireless Charger
    { orderId: orders[1].id, productId: products.find(p => p.slug === 'atomic-habits')!.id, variantId: bookAtomic.id, productName: 'Atomic Habits', variantSku: 'BOOK-ATHABITS', unitPrice: '16.99', quantity: 2 },
    { orderId: orders[1].id, productId: products.find(p => p.slug === 'wireless-charging-pad')!.id, variantId: chargerVariant.id, productName: 'Wireless Charging Pad', variantSku: 'WCP-15W', unitPrice: '24.99', quantity: 1 },
    // Order 3: Nordic Desk
    { orderId: orders[2].id, productId: products.find(p => p.slug === 'nordic-minimalist-desk')!.id, variantId: deskVariant.id, productName: 'Nordic Minimalist Desk', variantSku: 'DESK-OAK', unitPrice: '449.99', quantity: 1 },
  ]

  await db.insert(schema.orderItems).values(orderItemsData)

  console.log(`  Order Items: ${orderItemsData.length} inserted`)
  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
