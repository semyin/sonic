export { Wrapper }

import { Provider } from "@/components/theme/Provider"

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      {children}
    </Provider>
  )
}