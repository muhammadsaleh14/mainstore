import { useClerk } from '@clerk/clerk-react'
import { Button, Flex, Result, Spin } from 'antd'
import type { ReactNode } from 'react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { UserRole } from '@/types/api'

interface RoleGuardProps {
  allow: UserRole[]
  children: ReactNode
}

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { signOut } = useClerk()
  const { data, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (isError || !data || !allow.includes(data.role)) {
    return (
      <Result
        status="403"
        title="Access denied"
        subTitle="Your account does not have permission to use the admin dashboard."
        extra={
          <Button type="primary" onClick={() => signOut({ redirectUrl: '/sign-in' })}>
            Sign out
          </Button>
        }
      />
    )
  }

  return <>{children}</>
}
