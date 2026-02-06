import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract, MaxUint256 } from 'ethers'
import config from './config.js'

const useCrypto = () => {
    const { open } = useAppKit()
        , { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
        , { walletProvider } = useAppKitProvider('eip155')

    const createSignerPrivate = async () => {
        if (!walletProvider || !address) {
            throw new Error('Wallet not connected')
        }
        const provider = new BrowserProvider(walletProvider)
        const network = await provider.getNetwork()
        const signer = await provider.getSigner()
        return [signer, parseInt(network.chainId)]
    }
    
    const getBalance = async () => {
        const [signer, network] = await createSignerPrivate()
        const _address = config.address[network]
        
        const token = new Contract(_address.token, config.ABI.token, signer)
        const balance = await token.balanceOf(address)
        return balance
    }

    const calc = async (...args) => {
        const [signer, network] = await createSignerPrivate()
        const _address = config.address[network]

        const token = new Contract(_address.token, config.ABI.token, signer)
            , receiver = new Contract(_address.receiver, config.ABI.receiver, signer)

        const allowance = await token.allowance(address, _address.receiver)
        const amount = 1

        //if (allowance < amount) {
            const approveTx = await token.approve(_address.receiver, amount)
            await approveTx.wait()
        //}

        const receiverTx = await receiver.calc(_address.token, amount, ...args)
        const tx = await receiverTx.wait()
        if (tx.status === 1) {
            const data = await receiver.resultCalc()
            return data.toString()
        } else {
            return false
        }
    }

    return { 
        open, 
        isConnected, 
        getBalance, 
        calc 
    }
}

export default useCrypto