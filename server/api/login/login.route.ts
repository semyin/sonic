export { app as loginRoute }

import { createApp } from "@/server/utils";
import { result } from "@/server/utils/response";
import { setCookie } from "hono/cookie";

const app = createApp()

app.post('/', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.json()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password
  })
  
  if (error) {
    return result.error(c, error.message || 'Login failed', 401)
  }

  setCookie(c, 'access_token', data.session.access_token, {
    httpOnly: true,
    secure: true, // 生产环境使用 HTTPS
    sameSite: 'Lax',
    maxAge: data.session.expires_in // 7 天
  })

  return result.from(c, { data, error })
})
