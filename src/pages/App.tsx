import React, { Suspense } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
// import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
// import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
// import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

// import Landing from './Landing';
// import Home from './Home';
import Footer from '../components/Footer';
import SwapPage from './SwapPage';
import PoolPage from './PoolPage';
import Overview from './Overview';
import Tokens from './Tokens';
import Pairs from './Pairs';
import Token_detail from './Token_detail';
import Pair_detail from "./Pair_detail";
import Farms from "./Farms";
import Farm_detail from "./Farm_detail";
import FastBar from "./FastBar";
import Serve from "./Serve";
import Account from "./Account";
import { createBrowserHistory } from "history";

// const AppWrapper = styled.div`
//   display: flex;
//   flex-flow: column;
//   align-items: flex-start;
//   overflow-x: hidden;
// `

// const HeaderWrapper = styled.div`
//   ${({ theme }) => theme.flexRowNoWrap}
//   width: 100%;
//   justify-content: space-between;
// `

const BaseWrapper = styled.div`
  padding-top: 0;
`

const BodyWrapper = styled.div`
  padding-top: 96px;
  padding-bottom: 64px;
  // display: flex;
  // justify-content: center;
`
const History = createBrowserHistory({ basename: '', forceRefresh: false })

export default function App() {

  return (
    <Suspense fallback={null}>
      <Router history={History}>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        {/* <AppWrapper> */}
            {/* <Popups /> */}
            <Web3ReactManager>
              <Switch>
                {/* <Route exact strict path="/landing" component={Landing} /> */}
                <BaseWrapper>
                  <Header />
                  <BodyWrapper>
                    <Route exact strict path="/" component={SwapPage} />
                    <Route exact strict path="/home" component={Overview} />
                    <Route exact strict path="/swap" component={SwapPage} />
                    <Route exact strict path="/overview" component={Overview} />
                    <Route exact strict path="/tokens" component={Tokens} />
                    <Route exact strict path="/tokens/:tokenAddress" component={Token_detail} />
                    <Route exact strict path="/pairs" component={Pairs} />
                    <Route exact strict path="/pairs/:pairAddress" component={Pair_detail} />
                    <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                    <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                    <Route exact strict path="/find" component={PoolFinder} />
                    <Route exact strict path="/pool" component={PoolPage} />
                    <Route exact strict path="/farms" component={Farms} />
                    <Route exact strict path="/farms/:Id/:walletId" component={Farm_detail} />
                    <Route exact strict path="/fastbar/:walletId" component={FastBar} />
                    <Route exact strict path="/serve/:walletId" component={Serve} />
                    <Route exact strict path="/account" component={Account} />
                    <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                    <Route exact path="/add" component={AddLiquidity} />
                    <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                    <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                    <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                    <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                    <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                    <Route exact strict path="/migrate/v1" component={MigrateV1} />
                    <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
                    {/* <Route component={RedirectPathToSwapOnly} /> */}
                  </BodyWrapper>
                  <Footer />
                </BaseWrapper>
              </Switch>
            </Web3ReactManager>
            {/* <Marginer /> */}
        {/* </AppWrapper> */}
      </Router>
    </Suspense>
  )
}
