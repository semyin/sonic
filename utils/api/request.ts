import { ofetch, type $Fetch } from 'ofetch'
import type { FetchContext } from 'ofetch'
import { isSSR } from '../'

interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
  count?: number
}

interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, any>
  body?: any
  headers?: HeadersInit
  skipErrorHandler?: boolean
  showLoading?: boolean
  timeout?: number
  retry?: number
  retryDelay?: number
  rawResponse?: boolean
}

const appDomain = import.meta.env.PUBLIC_ENV__APP_DOMAIN || 'http://127.0.0.1:3000'

class Http {
  private instance: $Fetch
  private loadingCount = 0

  constructor() {
    this.instance = ofetch.create({
      baseURL: isSSR ? `${appDomain}/api` : '/api',
      timeout: 10000,
      onRequest: this.onRequest.bind(this),
      onRequestError: this.onRequestError.bind(this),
      onResponse: this.onResponse.bind(this),
      onResponseError: this.onResponseError.bind(this),
    })
  }

  private showLoading() {
    if (this.loadingCount === 0) {
      console.log('Loading...')
    }
    this.loadingCount++
  }

  private hideLoading() {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      console.log('Loading complete')
    }
  }

  private async onRequest(context: FetchContext) {
    const { request, options } = context

    // const token = localStorage.getItem('token')
    // if (token) {
    //   const headers = new Headers(options.headers)
    //   headers.set('Authorization', `Bearer ${token}`)
    //   options.headers = headers
    // }

    const httpOptions = options as HttpOptions
    if (httpOptions.showLoading) {
      this.showLoading()
    }

    const method = options.method || 'GET'
    const url = typeof request === 'string' ? request : request.toString()
    console.log(`[${method}]`, url)
  }

  private async onRequestError(context: FetchContext) {
    const { options } = context
    const httpOptions = options as HttpOptions
    
    if (httpOptions.showLoading) {
      this.hideLoading()
    }
    
    console.error('[Request Error]', context.error)
  }

  private async onResponse(context: FetchContext) {
    const { response, options } = context
    const httpOptions = options as HttpOptions

    if (httpOptions.showLoading) {
      this.hideLoading()
    }

    if (!response || response._data === undefined) {
      return Promise.reject(new Error('响应数据为空'))
    }

    const data = response._data as ResponseData

    if (data.code !== 200) {
      if (data.code === 401) {
        // localStorage.removeItem('token')
        // window.location.href = '/login'
      }

      if (!httpOptions.skipErrorHandler) {
        console.error(data.msg || '请求失败')
      }

      return Promise.reject(new Error(data.msg || '请求失败'))
    }

    if (httpOptions.rawResponse) {
      response._data = response._data // 返回原始响应体
    } else {
      response._data = data.data
    }

    // return data.data
  }

  private async onResponseError(context: FetchContext) {
    const { response, options } = context
    const httpOptions = options as HttpOptions

    if (httpOptions.showLoading) {
      this.hideLoading()
    }

    const status = response?.status ?? 500
    
    const errorMap: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求地址不存在',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
    }

    const message = errorMap[status] || `请求失败 (${status})`

    if (status === 401) {
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }

    if (!httpOptions.skipErrorHandler) {
      console.error(message)
    }

    throw new Error(message)
    // return Promise.reject(new Error(message))
  }

  async request<T = any>(url: string, options?: HttpOptions): Promise<T> {
    const result = await this.instance(url, options as any);
    return result;
  }

  get<T = any, P extends Record<string, any> | undefined = Record<string, any>>(url: string, params?: P, options?: Omit<HttpOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET', params })
  }

  post<T = any, D = any>(url: string, body?: D, options?: Omit<HttpOptions, 'method' | 'params'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', body })
  }

  put<T = any, D = any>(url: string, body?: D, options?: Omit<HttpOptions, 'method' | 'params'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', body })
  }

  delete<T = any, P extends Record<string, any> | undefined = Record<string, any>>(url: string, params?: P, options?: Omit<HttpOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE', params })
  }

  patch<T = any, D = any>(url: string, body?: D, options?: Omit<HttpOptions, 'method' | 'params'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH', body })
  }
}

export const request = new Http()

export default request
