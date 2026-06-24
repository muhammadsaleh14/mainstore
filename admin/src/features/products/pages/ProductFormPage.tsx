import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
} from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CreateProductInput, ProductStatus, UpdateProductInput } from '@/types/api'
import { VariantTable } from '../components/VariantTable'
import { useCreateProduct, useProduct, useUpdateProduct } from '../hooks/useProducts'

const STATUS_OPTIONS: { label: string; value: ProductStatus }[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
]

interface ProductFormValues {
  name: string
  slug?: string
  description?: string
  status: ProductStatus
  categoryId?: number | null
  sku: string
  price: number
  stockQuantity: number
}

export function ProductFormPage() {
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id ? Number(params.id) : undefined
  const isEdit = typeof id === 'number' && !Number.isNaN(id)

  const [form] = Form.useForm<ProductFormValues>()
  const categories = useCategories()
  const productQuery = useProduct(isEdit ? id : undefined)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct(isEdit ? id : 0)

  const product = productQuery.data

  useEffect(() => {
    if (isEdit && product) {
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        description: product.description ?? undefined,
        status: product.status,
        categoryId: product.categoryId ?? undefined,
      })
    }
  }, [isEdit, product, form])

  const categoryOptions = (categories.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const handleCreate = async () => {
    const values = await form.validateFields()
    const input: CreateProductInput = {
      name: values.name.trim(),
      slug: values.slug?.trim() || undefined,
      description: values.description?.trim() || null,
      status: values.status,
      categoryId: values.categoryId ?? null,
      defaultVariant: {
        sku: values.sku.trim(),
        price: values.price.toFixed(2),
        stockQuantity: values.stockQuantity,
        isDefault: true,
      },
    }
    createProduct.mutate(input, {
      onSuccess: (created) => navigate(`/products/${created.id}/edit`),
    })
  }

  const handleUpdate = async () => {
    const values = await form.validateFields()
    const input: UpdateProductInput = {
      name: values.name.trim(),
      slug: values.slug?.trim() || undefined,
      description: values.description?.trim() || null,
      status: values.status,
      categoryId: values.categoryId ?? null,
    }
    updateProduct.mutate(input)
  }

  if (isEdit && productQuery.isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (isEdit && productQuery.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Could not load product"
        description="The product may not exist or the API is unavailable."
      />
    )
  }

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit product' : 'Add product'}
        subtitle={isEdit ? product?.name : 'Create a product and its first variant'}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
            Back
          </Button>
        }
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Product details">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'disabled' as ProductStatus }}
            style={{ maxWidth: 640 }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="Nike Air Max 90" />
            </Form.Item>
            <Form.Item
              name="slug"
              label="Slug"
              extra="Leave blank to auto-generate from the name."
            >
              <Input placeholder="nike-air-max-90" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} placeholder="Product description" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
            <Form.Item name="categoryId" label="Category">
              <Select
                allowClear
                placeholder="Select a category"
                loading={categories.isLoading}
                options={categoryOptions}
              />
            </Form.Item>

            {!isEdit && (
              <>
                <Divider orientation="left">Default variant</Divider>
                <Form.Item
                  name="sku"
                  label="SKU"
                  rules={[{ required: true, message: 'SKU is required' }]}
                >
                  <Input placeholder="NIKE-AM90-001" />
                </Form.Item>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Price is required' }]}
                >
                  <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="stockQuantity"
                  label="Stock quantity"
                  rules={[{ required: true, message: 'Stock is required' }]}
                >
                  <InputNumber min={0} precision={0} style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button
                type="primary"
                loading={createProduct.isPending || updateProduct.isPending}
                onClick={isEdit ? handleUpdate : handleCreate}
              >
                {isEdit ? 'Save changes' : 'Create product'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {isEdit && product && (
          <VariantTable productId={product.id} variants={product.variants} />
        )}
      </Space>
    </>
  )
}
