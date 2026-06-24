import { UserButton } from '@clerk/clerk-react'
import {
  AppstoreOutlined,
  BulbOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Space, Tooltip, Typography, theme } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { RoleGuard } from '@/components/RoleGuard'
import { useUIStore } from '@/stores/ui.store'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/products', icon: <AppstoreOutlined />, label: 'Products' },
  { key: '/users', icon: <TeamOutlined />, label: 'Users' },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = useUIStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const themeMode = useUIStore((state) => state.themeMode)
  const toggleTheme = useUIStore((state) => state.toggleTheme)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const selectedKey =
    menuItems.find((item) => item.key !== '/' && location.pathname.startsWith(item.key))?.key ?? '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          style={{
            height: 56,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography.Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
            {collapsed ? 'MS' : 'MainStore'}
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          />
          <Space size="middle">
            <Tooltip title={themeMode === 'light' ? 'Dark mode' : 'Light mode'}>
              <Button type="text" icon={<BulbOutlined />} onClick={toggleTheme} aria-label="Toggle theme" />
            </Tooltip>
            <UserButton afterSignOutUrl="/sign-in" />
          </Space>
        </Header>
        <Content style={{ margin: 24 }}>
          <RoleGuard allow={['admin']}>
            <Outlet />
          </RoleGuard>
        </Content>
      </Layout>
    </Layout>
  )
}
