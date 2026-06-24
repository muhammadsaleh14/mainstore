import { Alert, Card, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { PageHeader } from '@/components/PageHeader'
import type { AdminUser, UserRole } from '@/types/api'
import { useUpdateUserRole, useUsers } from '../hooks/useUsers'

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Customer', value: 'customer' },
]

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'red',
  manager: 'blue',
  customer: 'default',
}

export function UsersPage() {
  const { data, isLoading, isError } = useUsers()
  const updateRole = useUpdateUserRole()

  const columns: ColumnsType<AdminUser> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email: string | null) => email ?? <Tag>no email</Tag>,
    },
    {
      title: 'Current role',
      dataIndex: 'role',
      width: 140,
      render: (role: UserRole) => <Tag color={ROLE_COLORS[role]}>{role}</Tag>,
    },
    {
      title: 'Change role',
      key: 'change-role',
      width: 180,
      render: (_, record) => (
        <Select<UserRole>
          value={record.role}
          options={ROLE_OPTIONS}
          style={{ width: '100%' }}
          loading={updateRole.isPending && updateRole.variables?.id === record.id}
          onChange={(role) => updateRole.mutate({ id: record.id, role })}
        />
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => dayjs(value).format('MMM D, YYYY'),
    },
  ]

  return (
    <>
      <PageHeader title="Users" subtitle="Manage accounts and roles" />
      {isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load users"
          description="Make sure your account has the admin role and the API is running."
        />
      ) : (
        <Card>
          <Table<AdminUser>
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
