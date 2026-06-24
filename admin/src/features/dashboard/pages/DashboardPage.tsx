import { AppstoreOutlined, ShoppingOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { PageHeader } from '@/components/PageHeader'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useUsers } from '@/features/users/hooks/useUsers'

export function DashboardPage() {
  const { data: me } = useCurrentUser()
  const users = useUsers()
  const products = useProducts()

  const enabledProducts = products.data?.filter((product) => product.status === 'enabled').length ?? 0

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={me?.email ? `Signed in as ${me.email}` : 'Welcome back'}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total users"
              value={users.data?.length ?? 0}
              loading={users.isLoading}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total products"
              value={products.data?.length ?? 0}
              loading={products.isLoading}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Enabled products"
              value={enabledProducts}
              loading={products.isLoading}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
