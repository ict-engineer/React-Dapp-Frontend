import { currencyEquals, Trade } from '@uniswap/sdk/dist'
import React, { useCallback, useMemo } from 'react'
import { IZeroXQuote } from '../../types'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'
import ZeroSwapModalFooter from './ZeroSwapModalFooter'
import ZeroSwapModalHeader from './ZeroSwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

function quoteMeaningfullyDiffers(quoteA: IZeroXQuote, quoteB: IZeroXQuote): boolean {
  if (quoteA.sellCurrencyAmount && quoteA.buyCurrencyAmount && quoteB.sellCurrencyAmount && quoteB.buyCurrencyAmount) {
    return (
      !currencyEquals(quoteA.sellCurrencyAmount?.currency, quoteB.sellCurrencyAmount?.currency) ||
      !quoteA.sellCurrencyAmount?.equalTo(quoteB.sellCurrencyAmount) ||
      !currencyEquals(quoteA.buyCurrencyAmount?.currency, quoteB.buyCurrencyAmount?.currency) ||
      !quoteA.buyCurrencyAmount?.equalTo(quoteB.buyCurrencyAmount)
    )
  }
  return false
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  zeroXQuote,
  originalZeroXQuote,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash
}: {
  isOpen: boolean
  trade: Trade | undefined
  originalTrade: Trade | undefined
  zeroXQuote: IZeroXQuote | undefined
  originalZeroXQuote: IZeroXQuote | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const showAcceptChanges = useMemo(
    () =>
      Boolean(
        (trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)) ||
          (zeroXQuote && originalZeroXQuote && quoteMeaningfullyDiffers(zeroXQuote, originalZeroXQuote))
      ),
    [originalTrade, originalZeroXQuote, trade, zeroXQuote]
  )

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : zeroXQuote ? (
      <ZeroSwapModalHeader
        zeroXQuote={zeroXQuote}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, zeroXQuote])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
      />
    ) : zeroXQuote ? (
      <ZeroSwapModalFooter
        onConfirm={onConfirm}
        zeroXQuote={zeroXQuote}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
      />
    ) : null
  }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade, zeroXQuote])

  // text to show while loading
  const inputAmount = trade ? trade.inputAmount : zeroXQuote?.sellCurrencyAmount
  const outputAmount = trade ? trade.outputAmount : zeroXQuote?.buyCurrencyAmount
  const pendingText = `Swapping ${inputAmount?.toSignificant(6)} ${
    inputAmount?.currency?.symbol
  } for ${outputAmount?.toSignificant(6)} ${outputAmount?.currency?.symbol}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Swap"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
