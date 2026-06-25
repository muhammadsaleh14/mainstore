import { z } from 'zod'
import { USER_ROLES } from './user.util'

export const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES, { message: 'Invalid role' }),
})
