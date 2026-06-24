import type { Context } from 'hono'
import type { z } from 'zod'

export function parseId(value: string): number | null {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: Response }

export async function parseJson<S extends z.ZodTypeAny>(
  c: Context,
  schema: S,
): Promise<ParseResult<z.infer<S>>> {
  const body = await c.req.json().catch(() => null)
  const result = schema.safeParse(body)

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Invalid request body'
    return { ok: false, response: c.json({ error: message }, 400) }
  }

  return { ok: true, data: result.data }
}
