import { Alert, Button, Card, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import type { OrderStatus, OrderSummary, PaymentStatus } from '@/types/api'
import { useOrders } from '../hooks/useOrders'
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from '../orderStatus'

export function OrdersPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useOrders()

  const columns: ColumnsType<OrderSummary> = [
    { title: 'Order', dataIndex: 'id', width: 90, render: (id: number) => `#${id}` },
    {
      title: 'Customer',
      dataIndex: 'customerEmail',
      render: (email: string | null) => email ?? <Tag>no email</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (status: OrderStatus) => (
        <Tag color={ORDER_STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      width: 120,
      render: (status: PaymentStatus) => <Tag color={PAYMENT_STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: 120,
      render: (total: string) => `$${total}`,
    },
    {
      title: 'Placed',
      dataIndex: 'createdAt',
      width: 150,
      render: (value: string) => dayjs(value).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/orders/${record.id}`)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Orders" subtitle="Manage customer orders" />
      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load orders"
          description="Make sure the API is running and your account has the admin or manager role."
        />
      ) : (
        <Card>
          <Table<OrderSummary>
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
