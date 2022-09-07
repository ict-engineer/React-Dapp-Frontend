import { CurrencyAmount, JSBI, Token, Trade, TradeType } from '@uniswap/sdk/dist'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
// import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
// import BetterTradeLink from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'

import { BETTER_TRADE_LINK_THRESHOLD, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { getTradeVersion, isTradeBetter } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTradeAndZeroX } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  tryParseAmount,
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import { formatUnits, parseUnits } from '@ethersproject/units'
import axios from 'axios'
import qs from 'qs'
import { IZeroXQuote } from '../../types'
import { useCurrencyBalances } from '../../state/wallet/hooks'
import Settings from '../../components/Settings'
import Timelapse from "../../components/Timelapse";
// import help from '../../assets/images/landing/help.svg'

import styled from 'styled-components'

const ButtonGroup = styled.div`
  display: inline-flex;
  margin-right: 6%;
`
const SettingBar = styled.div`
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
`
const SwapBox = styled.div`
  width: 423px;
  // height: 100%;
  @media only screen and (max-width: 1024px): {
    width: 330px !important;
  }
`
export default function Swap() {
  const { t } = useTranslation()
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // 0xAPI Quote
  const { chainId } = useActiveWeb3React()
  const [zeroXQuote, setZeroXQuote] = useState<IZeroXQuote | undefined>(undefined)
  const [zeroXSellCurrencyAmount, setZeroXSellCurrencyAmount] = useState<CurrencyAmount | undefined>(undefined)
  const [zeroXBuyCurrencyAmount, setZeroXBuyCurrencyAmount] = useState<CurrencyAmount | undefined>(undefined)
  const [zeroXError, setZeroXError] = useState<string | undefined>(undefined)

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v1Trade, v2Trade, currencyBalances, parsedAmount, currencies, inputError } = useDerivedSwapInfo()
  
  const swapInputError = inputError ? inputError : zeroXError
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const trade = showWrap
    ? undefined
    : {
        [Version.v1]: v1Trade,
        [Version.v2]: v2Trade
      }[toggledVersion]

  // const betterTradeLinkVersion: Version | undefined =
  //   toggledVersion === Version.v2 && isTradeBetter(v2Trade, v1Trade, BETTER_TRADE_LINK_THRESHOLD)
  //     ? Version.v1
  //     : toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade)
  //     ? Version.v2
  //     : undefined

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount || zeroXSellCurrencyAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount || zeroXBuyCurrencyAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )
  // modal and loading
  const [
    { showConfirm, tradeToConfirm, zeroXQuoteToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState
  ] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    zeroXQuoteToConfirm: IZeroXQuote | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    zeroXQuoteToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // get balances
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.INPUT] ?? undefined,
    currencies[Field.OUTPUT] ?? undefined
  ])

  // 0xAPI if there's no router
  useEffect(() => {
    setZeroXSellCurrencyAmount(undefined)
    setZeroXBuyCurrencyAmount(undefined)
    setZeroXQuote(undefined)
    setZeroXError(undefined)

    if (account && noRoute && userHasSpecifiedInputOutput) {
      const inputCurrency = currencies[Field.INPUT]
      const outputCurrency = currencies[Field.OUTPUT]
      const inputToken = inputCurrency instanceof Token ? inputCurrency : undefined
      const outputToken = outputCurrency instanceof Token ? outputCurrency : undefined
      const isExactIn: boolean = independentField === Field.INPUT

      if (inputCurrency && outputCurrency) {
        let params: any = {}

        if (isExactIn) {
          params = {
            sellToken: inputToken?.address || inputCurrency.symbol,
            sellAmount: parseUnits(typedValue, inputCurrency.decimals).toString(),
            buyToken: outputToken?.address || outputCurrency.symbol
          }
        } else {
          params = {
            buyToken: outputToken?.address || outputCurrency.symbol,
            buyAmount: parseUnits(typedValue, outputCurrency.decimals).toString(),
            sellToken: inputToken?.address || inputCurrency.symbol
          }
        }
        const get0xQuote = async () => {
          try {
            const response = await axios.get(
              `https://api.0x.org/swap/v1/quote?${qs.stringify({ ...params, takerAddress: account })}`
            )
            const sellCurrencyAmount = tryParseAmount(
              formatUnits(response.data.sellAmount, inputCurrency.decimals),
              inputCurrency
            )
            const buyCurrencyAmount = tryParseAmount(
              formatUnits(response.data.buyAmount, outputCurrency.decimals),
              outputCurrency
            )
            const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT

            if (sellCurrencyAmount && buyCurrencyAmount) {
              setZeroXQuote({ ...response.data, sellCurrencyAmount, buyCurrencyAmount, tradeType })
              setZeroXSellCurrencyAmount(sellCurrencyAmount)
              setZeroXBuyCurrencyAmount(buyCurrencyAmount)

              if (sellCurrencyAmount && relevantTokenBalances[0]?.lessThan(sellCurrencyAmount)) {
                setZeroXError(`Insufficient ${inputCurrency.symbol} balance`)
              }
            }
          } catch {
            try {
              const response = await axios.get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)
              const sellCurrencyAmount = tryParseAmount(
                formatUnits(response.data.sellAmount, inputCurrency.decimals),
                inputCurrency
              )
              const buyCurrencyAmount = tryParseAmount(
                formatUnits(response.data.buyAmount, outputCurrency.decimals),
                outputCurrency
              )
              const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT

              if (sellCurrencyAmount && buyCurrencyAmount) {
                setZeroXQuote({ ...response.data, sellCurrencyAmount, buyCurrencyAmount, tradeType })
                setZeroXSellCurrencyAmount(sellCurrencyAmount)
                setZeroXBuyCurrencyAmount(buyCurrencyAmount)

                if (sellCurrencyAmount && relevantTokenBalances[0]?.lessThan(sellCurrencyAmount)) {
                  setZeroXError(`Insufficient ${inputCurrency.symbol} balance`)
                }
              }
            } catch (error) {
              setZeroXError(error.response?.data?.reason)
            }
          }
        }

        get0xQuote()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chainId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currencies[Field.INPUT],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    currencies[Field.OUTPUT],
    typedValue,
    independentField,
    noRoute,
    userHasSpecifiedInputOutput
  ])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTradeAndZeroX(
    trade,
    allowedSlippage,
    zeroXQuote,
    zeroXSellCurrencyAmount
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    zeroXQuote,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade, zeroXQuote)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      zeroXQuoteToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined
    })
    swapCallback()
      .then(hash => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          zeroXQuoteToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash
        })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade ? trade.inputAmount?.currency?.symbol : zeroXQuote?.sellCurrencyAmount?.currency.symbol,
            trade ? trade.outputAmount?.currency?.symbol : zeroXQuote?.buyCurrencyAmount?.currency.symbol,
            getTradeVersion(trade)
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          zeroXQuoteToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [
    tradeToConfirm,
    zeroXQuoteToConfirm,
    account,
    priceImpactWithoutFee,
    recipient,
    recipientAddress,
    showConfirm,
    swapCallback,
    trade,
    zeroXQuote
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, zeroXQuoteToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, zeroXQuoteToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      zeroXQuoteToConfirm: zeroXQuote,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm
    })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, zeroXQuote, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  return (
    <SwapBox>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <AppBody>
        {/* <SwapPoolTabs active={'swap'} /> */}
        <SettingBar>
          <Text fontWeight={600} fontSize={24}>Swap</Text>
          <ButtonGroup>
            <Timelapse startTime={60} />
            <Settings />
          </ButtonGroup>
        </SettingBar>
        <Wrapper id="swap-page" style={{ padding: '25px' }}>
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            zeroXQuote={zeroXQuote}
            originalZeroXQuote={zeroXQuoteToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From '+(currencies.INPUT?.symbol ? currencies.INPUT?.symbol?.toUpperCase() : '')}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                  <ArrowUp
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper>
                {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To '+(currencies.OUTPUT?.symbol ? currencies.OUTPUT?.symbol?.toUpperCase() : '')}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
            />

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : showWrap ? (
              <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput && !zeroXQuote ? (
              <GreyCard style={{ textAlign: 'center' }}>
                <TYPE.main mb="4px">{t('insufficientLiquidityForThisTrade')}</TYPE.main>
              </GreyCard>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                    'Approve ' + currencies[Field.INPUT]?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  // style={{ marginLeft: 91 }}
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        zeroXQuoteToConfirm: zeroXQuote,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined
                      })
                    }
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={16} fontWeight={500}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Text>
                </ButtonError>
              </RowBetween>
            ) : (
              <ButtonError
                style={{ width: '100%' }}
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      zeroXQuoteToConfirm: zeroXQuote,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined
                    })
                  }
                }}
                id="swap-button"
                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                <Text fontSize={20} fontWeight={500}>
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 3 && !isExpertMode
                    ? `Price Impact Too High`
                    : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                </Text>
              </ButtonError>
            )}
            {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            {/* {betterTradeLinkVersion && <BetterTradeLink version={betterTradeLinkVersion} />} */}
          </BottomGrouping>
          
        </Wrapper>
        {showWrap ? null : (
          <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
            <AutoColumn gap="4px">
              {Boolean(trade) && (
                <RowBetween align="center">
                  <Text fontWeight={500} fontSize={14} color={theme.text2}>
                    {t('price')}
                  </Text>
                  <TradePrice
                    price={trade?.executionPrice}
                    showInverted={showInverted}
                    setShowInverted={setShowInverted}
                  />
                </RowBetween>
              )}
              {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                <RowBetween align="center">
                  <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                    Slippage Tolerance
                  </ClickableText>
                  <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                    {allowedSlippage / 100}%
                  </ClickableText>
                </RowBetween>
              )}
            </AutoColumn>
          </Card>
        )}
        {/* <StatusPanel>
          <AutoRow gap="lm"justify="space-between" >
            <AutoColumn style={{ alignItems: 'left', textAlign: 'left' }}>
              <TextGroup>
                <Text mr={2} fontWeight={500} fontSize={14}>{'Slippage Tolerance '}</Text><img src={help} alt={'slippage tolerance'} />
              </TextGroup>
              <TextGroup>
                <Text mr={2} fontWeight={500} fontSize={14}>{'Minimum Received '}</Text><img src={help} alt={'minimum received'} />
              </TextGroup>              
              <Text mb={2} fontWeight={500} fontSize={14}>{'Gas Fees'}</Text>
            </AutoColumn>
            <AutoColumn style={{ alignItems: 'right', textAlign: 'right' }}>
              <Text mb={2} fontWeight={700} fontSize={14}>{'2%'}</Text>
              <Text mb={2} fontWeight={700} fontSize={14}>{'1,800.40 DAI'}</Text>
              <Text mb={2} fontWeight={700} fontSize={14}>{'2%'}</Text> 
            </AutoColumn>
          </AutoRow>
        </StatusPanel> */}
        <AdvancedSwapDetailsDropdown trade={trade} />
      </AppBody>
    </SwapBox>
  )
}
