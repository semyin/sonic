const getBaseUrl = () => {
  if (!import.meta.env.SSR) return ''
  return 'http://localhost:3000'
}

export const apiClient = {
  get: (url: string) => fetch(`${getBaseUrl()}${url}`).then(res => res.json()),

  post: (url: string, data: unknown) =>
    fetch(`${getBaseUrl()}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  put: (url: string, data: unknown) =>
    fetch(`${getBaseUrl()}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  patch: (url: string, data: unknown) =>
    fetch(`${getBaseUrl()}${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  delete: (url: string) =>
    fetch(`${getBaseUrl()}${url}`, { method: 'DELETE' }).then(res => res.json())
}
