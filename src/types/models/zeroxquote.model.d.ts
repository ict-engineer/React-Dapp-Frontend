import { CurrencyAmount } from '@uniswap/sdk/dist'

export interface IZeroXQuote {
  price: string
  guaranteedPrice: string
  to: string
  data: string
  value: string
  gas: string
  estimatedGas: string
  gasPrice: string
  minimumProtocolFee: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  buyCurrencyAmount: CurrencyAmount
  sellAmount: string
  sellCurrencyAmount: CurrencyAmount
  allowanceTarget: string
  tradeType: TradeType
}
