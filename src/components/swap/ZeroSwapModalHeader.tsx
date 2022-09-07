import { TradeType } from '@uniswap/sdk/dist'
import React, { useContext } from 'react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { IZeroXQuote } from '../../types'

export default function ZeroSwapModalHeader({
  zeroXQuote,
  recipient,
  showAcceptChanges,
  onAcceptChanges
}: {
  zeroXQuote: IZeroXQuote
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  //   const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
  //     trade,
  //     allowedSlippage
  //   ])
  //   const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  //   const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const priceImpactSeverity = 0

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={zeroXQuote.sellCurrencyAmount.currency}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && zeroXQuote.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
          >
            {zeroXQuote.sellCurrencyAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {zeroXQuote.sellCurrencyAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo
            currency={zeroXQuote.buyCurrencyAmount.currency}
            size={'24px'}
            style={{ marginRight: '12px' }}
          />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && zeroXQuote.tradeType === TradeType.EXACT_INPUT
                ? theme.primary1
                : ''
            }
          >
            {zeroXQuote.buyCurrencyAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {zeroXQuote.buyCurrencyAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
