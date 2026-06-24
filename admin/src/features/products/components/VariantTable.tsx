import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import type { ProductVariant, UpdateVariantInput, VariantInput } from '@/types/api'
import { useAddVariant, useUpdateVariant } from '../hooks/useProducts'
import { VariantFormModal } from './VariantFormModal'

interface VariantTableProps {
  productId: number
  variants: ProductVariant[]
}

export function VariantTable({ productId, variants }: VariantTableProps) {
  const addVariant = useAddVariant(productId)
  const updateVariant = useUpdateVariant(productId)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductVariant | undefined>(undefined)

  const openAdd = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const openEdit = (variant: ProductVariant) => {
    setEditing(variant)
    setModalOpen(true)
  }

  const handleSubmit = (value: VariantInput) => {
    if (editing) {
      const input: UpdateVariantInput = value
      updateVariant.mutate(
        { variantId: editing.id, input },
        { onSuccess: () => setModalOpen(false) },
      )
    } else {
      addVariant.mutate(value, { onSuccess: () => setModalOpen(false) })
    }
  }

  const columns: ColumnsType<ProductVariant> = [
    { title: 'SKU', dataIndex: 'sku' },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 120,
      render: (price: string) => `$${Number(price).toFixed(2)}`,
    },
    { title: 'Stock', dataIndex: 'stockQuantity', width: 100 },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      width: 100,
      render: (isDefault: boolean) => (isDefault ? <Tag color="blue">default</Tag> : null),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button size="small" onClick={() => openEdit(record)}>
          Edit
        </Button>
      ),
    },
  ]

  return (
    <Card
      title="Variants"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add variant
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Table<ProductVariant>
          rowKey="id"
          columns={columns}
          dataSource={variants}
          pagination={false}
          size="small"
        />
      </Space>
      <VariantFormModal
        open={modalOpen}
        initialValue={editing}
        confirmLoading={addVariant.isPending || updateVariant.isPending}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
