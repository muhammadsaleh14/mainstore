import { Form, InputNumber, Input, Modal, Switch } from 'antd'
import { useEffect } from 'react'
import type { ProductVariant, VariantInput } from '@/types/api'

interface VariantFormModalProps {
  open: boolean
  initialValue?: ProductVariant
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (value: VariantInput) => void
}

interface VariantFormValues {
  sku: string
  price: number
  stockQuantity: number
  barcode?: string
  weightGrams?: number
  isDefault: boolean
}

export function VariantFormModal({
  open,
  initialValue,
  confirmLoading,
  onCancel,
  onSubmit,
}: VariantFormModalProps) {
  const [form] = Form.useForm<VariantFormValues>()
  const isEdit = !!initialValue

  useEffect(() => {
    if (open) {
      if (initialValue) {
        form.setFieldsValue({
          sku: initialValue.sku,
          price: Number(initialValue.price),
          stockQuantity: initialValue.stockQuantity,
          barcode: initialValue.barcode ?? undefined,
          weightGrams: initialValue.weightGrams ?? undefined,
          isDefault: initialValue.isDefault,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initialValue, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    onSubmit({
      sku: values.sku.trim(),
      price: values.price.toFixed(2),
      stockQuantity: values.stockQuantity,
      barcode: values.barcode?.trim() || null,
      weightGrams: values.weightGrams ?? null,
      isDefault: values.isDefault ?? false,
    })
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit variant' : 'Add variant'}
      okText={isEdit ? 'Save' : 'Add'}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ isDefault: false }}>
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ required: true, message: 'SKU is required' }]}
        >
          <Input placeholder="NIKE-AM-001" />
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
        <Form.Item name="barcode" label="Barcode (optional)">
          <Input placeholder="UPC / EAN" />
        </Form.Item>
        <Form.Item name="weightGrams" label="Weight in grams (optional)">
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="isDefault" label="Default variant" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}
