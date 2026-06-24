import { Alert, Card, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { PageHeader } from '@/components/PageHeader'
import type { Product, ProductStatus, ProductVariant } from '@/types/api'
import { useProducts } from '../hooks/useProducts'

const STATUS_COLORS: Record<ProductStatus, string> = {
  draft: 'default',
  active: 'green',
  archived: 'orange',
}

function formatPriceRange(variants: ProductVariant[]): string {
  if (variants.length === 0) return '—'
  const prices = variants.map((variant) => Number(variant.price))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} – $${max.toFixed(2)}`
}

function totalStock(variants: ProductVariant[]): number {
  return variants.reduce((sum, variant) => sum + variant.stockQuantity, 0)
}

export function ProductsPage() {
  const { data, isLoading, isError } = useProducts()

  const columns: ColumnsType<Product> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status: ProductStatus) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: 'Variants',
      key: 'variants',
      width: 100,
      render: (_, record) => record.variants.length,
    },
    {
      title: 'Price',
      key: 'price',
      width: 160,
      render: (_, record) => formatPriceRange(record.variants),
    },
    {
      title: 'Stock',
      key: 'stock',
      width: 100,
      render: (_, record) => totalStock(record.variants),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      width: 160,
      render: (value: string) => dayjs(value).format('MMM D, YYYY'),
    },
  ]

  return (
    <>
      <PageHeader title="Products" subtitle="Catalog overview" />
      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load products"
          description="Make sure the API is running at the configured URL."
        />
      ) : (
        <Card>
          <Table<Product>
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </>
  )
}
