import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import vikeCloudflare from 'vike-cloudflare/config'

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout

  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",

  extends: [vikeReact, vikeCloudflare],

  server: 'server/index.ts',
  passToClient: ['msg'],
} satisfies Config;
