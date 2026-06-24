import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { SignInPage } from '@/features/auth/pages/SignInPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProductFormPage } from '@/features/products/pages/ProductFormPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { DashboardLayout } from '@/layouts/DashboardLayout'

export const router = createBrowserRouter([
  {
    path: '/sign-in/*',
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/new', element: <ProductFormPage /> },
          { path: 'products/:id/edit', element: <ProductFormPage /> },
          { path: 'users', element: <UsersPage /> },
        ],
      },
    ],
  },
])
