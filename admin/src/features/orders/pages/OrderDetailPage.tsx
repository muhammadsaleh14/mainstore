import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Flex,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import type { OrderItem, OrderStatusUpdate } from '@/types/api'
import { useOrder, useUpdateOrderStatus } from '../hooks/useOrders'
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from '../orderStatus'

export function OrderDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id ? Number(params.id) : undefined

  const { data: order, isLoading, isError } = useOrder(id)
  const updateStatus = useUpdateOrderStatus(id ?? 0)

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (isError || !order) {
    return (
      <Alert
        type="error"
        showIcon
        message="Could not load order"
        description="The order may not exist or the API is unavailable."
      />
    )
  }

  const itemColumns: ColumnsType<OrderItem> = [
    { title: 'Product', dataIndex: 'productName' },
    { title: 'SKU', dataIndex: 'variantSku', width: 160 },
    { title: 'Unit price', dataIndex: 'unitPrice', width: 120, render: (v: string) => `$${v}` },
    { title: 'Qty', dataIndex: 'quantity', width: 80 },
    { title: 'Line total', dataIndex: 'lineTotal', width: 120, render: (v: string) => `$${v}` },
  ]

  const address = order.shippingAddress

  const statusAction = (() => {
    if (order.status === 'paid') return { label: 'Mark as shipped', next: 'shipped' as OrderStatusUpdate }
    if (order.status === 'shipped')
      return { label: 'Mark as delivered', next: 'delivered' as OrderStatusUpdate }
    return null
  })()

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        subtitle={dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>
            Back
          </Button>
        }
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered size="small">
            <Descriptions.Item label="Status">
              <Tag color={ORDER_STATUS_COLORS[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment">
              <Tag color={PAYMENT_STATUS_COLORS[order.paymentStatus]}>{order.paymentStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Customer">{order.customerEmail ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Subtotal">${order.subtotal}</Descriptions.Item>
            <Descriptions.Item label="Shipping">${order.shippingTotal}</Descriptions.Item>
            <Descriptions.Item label="Total">${order.total}</Descriptions.Item>
          </Descriptions>

          {(statusAction || order.status === 'pending_payment') && (
            <Space style={{ marginTop: 16 }}>
              {statusAction && (
                <Button
                  type="primary"
                  loading={updateStatus.isPending}
                  onClick={() => updateStatus.mutate(statusAction.next)}
                >
                  {statusAction.label}
                </Button>
              )}
              {order.status === 'pending_payment' && (
                <Popconfirm
                  title="Cancel this order?"
                  okText="Cancel order"
                  onConfirm={() => updateStatus.mutate('cancelled')}
                >
                  <Button danger loading={updateStatus.isPending}>
                    Cancel order
                  </Button>
                </Popconfirm>
              )}
            </Space>
          )}
        </Card>

        <Card title="Shipping address">
          <Descriptions column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Name">{address.fullName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{address.phone ?? '—'}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {[address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
                .filter(Boolean)
                .join(', ')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Items">
          <Table<OrderItem>
            rowKey="id"
            columns={itemColumns}
            dataSource={order.items}
            pagination={false}
          />
        </Card>
      </Space>
    </>
  )
}
