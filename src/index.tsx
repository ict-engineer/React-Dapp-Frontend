import { createWeb3ReactRoot, Web3ReactProvider } from '@sushi-web3-react/core'
import 'inter-ui'
import React from 'react'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
import { NetworkContextName } from './constants'
import './i18n'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import StyledThemeProvider, { ThemedGlobalStyle } from './theme'
import getLibrary from './utils/getLibrary'
import { useDarkModeManager } from './state/user/hooks'
import CssBaseline from "@material-ui/core/CssBaseline";
import Mode from "./config/theme.json";
import { SnackbarProvider } from "notistack";
import {
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import './assets/css/style.css'
import "./assets/css/font.css"


const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ; (window.ethereum as any).autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID)
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})

interface MuiThemeProviderProps {
  children: any
}

const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  let themeMode = 'light';
  if (useDarkModeManager()[0]) {
    themeMode = 'dark';
  } else {
    themeMode = 'light';
  }
  const theme = createMuiTheme((Mode as any)[themeMode]);
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <SnackbarProvider style={{position: "relative", top: '90px'}} anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}>
        <Provider store={store}>
          <Updaters />
          <StyledThemeProvider>
            <MuiThemeProvider>
              <CssBaseline />
              <ThemedGlobalStyle />
              <App />
            </MuiThemeProvider>
          </StyledThemeProvider>
        </Provider>
      </SnackbarProvider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
