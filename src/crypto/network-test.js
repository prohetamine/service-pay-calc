import { defineChain } from '@reown/appkit/networks'

const networkTest = defineChain({
  id: 31337,
  chainNamespace: "eip155",
  name: "networkTest",
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    }
  }
})

export default networkTest