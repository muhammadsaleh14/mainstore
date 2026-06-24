import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp, ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { AuthTokenSync } from '@/components/AuthTokenSync'
import { env } from '@/config/env'
import { queryClient } from '@/lib/query-client'
import { router } from '@/routes/router'
import { useUIStore } from '@/stores/ui.store'

export default function App() {
  const themeMode = useUIStore((state) => state.themeMode)

  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey} afterSignOutUrl="/sign-in">
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: '#1677ff' },
          }}
        >
          <AntdApp>
            <AuthTokenSync />
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
