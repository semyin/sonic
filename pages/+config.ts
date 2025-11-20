import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import vikeReactQuery from 'vike-react-query/config'
import vikeCloudflare from 'vike-cloudflare/config'

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout

  // https://vike.dev/head-tags
  title: "My Vike App",

  description: "Demo showcasing Vike",

  

  stream: true,

   queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // 禁用窗口聚焦时重新请求
        refetchOnMount: false, // 禁用组件重新挂载时重新请求
        retry: 0, // 失败重试次数为0
      }
    }
  },

  extends: [vikeReact, vikeCloudflare, vikeReactQuery],

  server: 'server/index.ts',
  passToClient: ['msg'],
} satisfies Config;
