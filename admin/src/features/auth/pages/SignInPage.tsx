import { SignIn } from '@clerk/clerk-react'
import { Flex } from 'antd'

export function SignInPage() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', padding: 24 }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-in" forceRedirectUrl="/" />
    </Flex>
  )
}
