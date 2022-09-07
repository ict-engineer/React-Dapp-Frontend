import { ChainId } from '@uniswap/sdk/dist'
import React, { useEffect, useState } from "react";
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

//////////////////////////////////////
import clsx from 'clsx';

// ** Import Material-Ui Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { Scrollbars } from 'react-custom-scrollbars';
// ** Import Material-Ui Icons
import Typography from "@material-ui/core/Typography";
import LaunchIcon from '@material-ui/icons/Launch';
import Box from "@material-ui/core/Box";
import axios from 'axios'

// ** Import Actions
// import { History } from "../theme";
// ** Import Assets
import fasttoken from "../../assets/images/landing/fasttoken.png";
import Logo from "../../assets/images/landing/logo_white.png";
import Logo_dark from "../../assets/images/landing/logo_dark.png";
import Logo_mobile from "../../assets/images/logo_original.png";

// ** Import Icons
import Sun from "../../assets/icons/sun.png";
import LightSun from "../../assets/icons/light_sun.png";
import Moon from "../../assets/icons/moon.png";
import Apps from "../../assets/icons/apps.png";
import twitter from "../../assets/images/landing/twitter.png";
import telegram from "../../assets/images/landing/telegram.png";
import union from "../../assets/images/union.svg";
import global from "../../assets/images/global.svg";
import album from "../../assets/images/album.svg";

import twitter_hover from "../../assets/images/landing/twitter_hover.png";
import telegram_hover from "../../assets/images/landing/telegram_hover.png";
import twitter_white from "../../assets/images/landing/twitter_white.png";
import telegram_white from "../../assets/images/landing/telegram_white.png";
// import Logo from '../../assets/images/logo.png'
// import LogoDark from '../../assets/images/logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import menu_icon from "../../assets/images/landing/menu_icon.png";
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
// import { CardNoise } from '../earn/styled'
// import { CountUp } from 'use-count-up'

import { YellowCard } from '../Card'
// import Settings from '../Settings'
// import Menu from '../Menu'

// import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
// import ClaimModal from '../claim/ClaimModal'
// import { useShowClaimPopup } from '../../state/application/hooks'
// import { useUserHasAvailableClaim } from '../../state/claim/hooks'
// import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
// import { Dots } from '../swap/styleds'
// import Modal from '../Modal'
// import UniBalanceContent from './UniBalanceContent'
// import usePrevious from '../../hooks/usePrevious'
import useStyles from "../../assets/styles";
import { useHistory } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import { injected, walletconnect, walletlink, fortmatic, portis, lattice } from '../../connectors'
// import slide_bg from "../../assets/images/landing/slide_bg.svg";

const AccountElement = styled.div<{ active: boolean }>`

`

// const UNIAmount = styled(AccountElement)`
//   color: white;
//   padding: 4px 8px;
//   height: 36px;
//   font-weight: 500;
//   background-color: ${({ theme }) => theme.bg3};
//   background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
// `

// const UNIWrapper = styled.span`
//   width: fit-content;
//   position: relative;
//   cursor: pointer;

//   :hover {
//     opacity: 0.8;
//   }

//   :active {
//     opacity: 0.9;
//   }
// `

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`
const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`
const Transition = React.forwardRef<unknown, TransitionProps>((props: any, ref) => <Slide direction="up" ref={ref} {...props} />);

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}
interface hoverState {
  icon: string,
  state: boolean
}

export default function Header() {
  const classes = useStyles.header();
  const { account, chainId } = useActiveWeb3React()
  // const { t } = useTranslation()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const { connector } = useActiveWeb3React()
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  ////////////////////////////////////////////////////////////////////
  const [profileOptions, setProfileOptions] = useState(null);
  const [activeDrawer, setActiveDrawer] = useState("overview");
  const [activeTab, setActiveTab] = useState(1);
  const History = useHistory();
  const [open, setDrawerOpenState] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [fastprice, setFastPrice] = useState('')
  const [ishover, setIsHover] = useState<hoverState>({
    icon: '',
    state: false
  });
  const isMetamask = window.ethereum //&& window.ethereum.isMetaMask
  let walletId = '0';
  if(isMetamask){
      walletId = '1';
  }else if(connector === walletconnect || connector === lattice || connector === walletlink || connector === fortmatic || connector === portis){
    walletId = '2';
  }
  // ** Declare Actions
  const handleChange = (prop: string) => {
    setActiveDrawer(prop);
    sessionStorage.setItem("activeDrawer", prop);
    switch (prop) {
      case "overview":
        gotoPage('overview');
        break;
      case "tokens":
        gotoPage('tokens');
        break;
      case "pairs":
        gotoPage('pairs');
        break;
      default:
        break;
    }
  };
  const handleChangeTab = (event: any, newActiveTab: any) => {
    setActiveTab(newActiveTab)
    if (newActiveTab === 0) {
      sessionStorage.setItem("activeDrawer", 'overview');
      gotoPage('home')
    } else if (newActiveTab === 1) {
      gotoPage('swap')
    } else if (newActiveTab === 2) {
      gotoPage('pool')
    } else if (newActiveTab === 3) {
      // window.open("https://fastswap.exchange/farms/1", "_blank");
      gotoPage('farms')
    } else if (newActiveTab === 4) {
      //check wallet id
      gotoPage('fastbar/'+walletId)
    }
    sessionStorage.setItem("currentActiveTab", newActiveTab);
  }
  //   const handleDarkMode = () => {
  //     console.log(darkMode)
  //     if(darkMode === "dark"){
  //         localStorage.setItem("themeMode", "light")
  //     } else {
  //         localStorage.setItem("themeMode", "dark")
  //     }
  //     window.location.reload();
  // };
  const openProfileOptions = (event: any) => {
    setProfileOptions(event.currentTarget);
  };
  const closeProfileOptions = () => {
    setProfileOptions(null);
  };

  const gotoPage = (page: any) => {
    History.push(`/${page}`);
    // window.location.reload();
  };
  const unlisten = History.listen((location: any) => {
    if (window.location.pathname.includes('account'))
      setDrawerOpenState(false)
  });
  useEffect(() => {
    let path = window.location.pathname;
    if (path === "/home" || path === "/overview" || path.includes('/tokens') || path.includes('/pairs')) {
      setDrawerOpenState(true)
    } else {
      setDrawerOpenState(false)
    }
  }, [window.location.pathname])
  // ** Declare Effects
  useEffect(() => {
    const currentDrawer = sessionStorage.getItem("activeDrawer");
    const currentActiveTab = sessionStorage.getItem("currentActiveTab") as any
    if (window.location.pathname === "/swap" || window.location.pathname === "/")
      setActiveTab(1)
    else
      setActiveTab(parseInt(currentActiveTab))
    
    if (currentDrawer)
      setActiveDrawer(currentDrawer)
    else
      setActiveDrawer("overview")
  }, [window.location.pathname]);
  const openTwitter = () => {
    window.open("https://twitter.com/fastswapdex")
  }
  const openTelegram = () => {
    window.open("https://t.me/fastswapdex")
  }
  const openServe = () => {
    // window.open("https://fastswap.exchange/convert-fee/1")
    gotoPage('serve/'+walletId)
    handleClose()
    sessionStorage.setItem("currentActiveTab", '9');
  }
  const openLaunchSpot = () => {
    window.open("https://fastswap.exchange/shares/1")
  }
  const [openSlide, setOpenSlide] = useState(false);
  const handleClickSlide = () => {
    setOpenSlide(true);
  };
  const handleClose = () => {
    setOpenSlide(false);
  };
  const openLanding = () => {
    // window.open('https://fastswap.exchange/')
    gotoPage('swap')
    setActiveTab(1)
  }
  const openMyAccount = () => {
    sessionStorage.setItem("currentActiveTab", '9');
    gotoPage('account')
    handleClose()
  }
  /////////////////////////////////////////////////////////////////////

  // const toggleClaimModal = useToggleSelfClaimModal()

  // const availableClaim: boolean = useUserHasAvailableClaim(account)

  // const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  // const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  // const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  // const showClaimPopup = useShowClaimPopup()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  useEffect(()=>{
    try {
      axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc888a0ab4831a29e6ca432babf52e353d23db3c2`)
      .then(response => {
          setFastPrice(response.data.market_data.current_price.usd)
      })
    } catch (e) {
        console.log(`Axios request failed: ${e}`)
    }
  })
  return (
    <>
      <AppBar
        position="static"
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar} style={{ borderBottom: darkMode ? "1px solid #757B75" : "1px solid #CECECE"}}>
          {isMobile ?
            <IconButton className={classes.landingButton} onClick={() => openLanding()}>
              <img src={Logo_mobile} alt="Logo_mobile" />
            </IconButton> :
            <IconButton className={classes.landingButton} onClick={() => openLanding()}>
              <UniIcon>
                {darkMode ? <img src={Logo_dark} alt="logo_dark" /> : <img src={Logo} alt="logo" />}
              </UniIcon>
            </IconButton>
          }
          <div className={classes.spacing} />
          {isMobile &&
            <>
              <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && userEthBalance ? (
                  <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    {userEthBalance?.toSignificant(4)} ETH
                  </BalanceText>
                ) : null}
                <Web3Status />
              </AccountElement>
              <IconButton onClick={handleClickSlide}><img alt="icon" src={menu_icon} /></IconButton>
              <Dialog fullScreen open={openSlide} style={{ zIndex: 99000000 }} onClose={handleClose} TransitionComponent={Transition}>
                <Box className={classes.slideScreen}>
                  <Toolbar style={{ height: 96 }}>
                    <IconButton className={classes.landingButton} onClick={() => openLanding()}>
                      <UniIcon>
                        <img src={Logo_dark} alt="logo_dark" />
                      </UniIcon>
                    </IconButton>
                    <Box className={classes.spacing} />
                    <IconButton onClick={handleClose} aria-label="close" style={{ color: "white" }}>
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                  <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography style={{ fontSize: 20, color: "#9DD1B2", paddingLeft: 32 }}>xFast Price</Typography>
                    <Typography style={{ fontSize: 20, color: "#9DD1B2", paddingRight: 32 }}>${Number(fastprice).toFixed(2)}</Typography>
                  </Box>
                  <List component="nav" onMouseLeave={closeProfileOptions} className={classes.dropMenu}
                    style={{ height: "100%", width: "100%", borderRadius: 0, boxShadow: "none" }}
                  >
                    <ListItem button className={classes.listItem} onClick={() => openServe()}>
                      <ListItemText
                        primary={<Typography className={classes.mobilePrimaryText}>Serve</Typography>}
                      // secondary={<Typography className={classes.secondaryText}>Convert Trading fees</Typography>}
                      />
                    </ListItem>
                    <ListItem disabled button className={classes.listItem} onClick={() => openLaunchSpot()}>
                      <ListItemText
                        primary={<Box style={{ display: "flex", alignItems: "center" }}><Typography className={classes.mobilePrimaryText}>Launch Spot</Typography><LaunchIcon style={{color: "white"}} /></Box>}
                      // secondary={<Typography className={classes.secondaryText}>Stake Fst to participate in IDO</Typography>}
                      />
                    </ListItem>
                    <ListItem disabled button className={classes.listItem}>
                      <ListItemText
                        primary={
                          <Box style={{ justifyContent: "space-between", alignItems: "center", display: "flex" }}>
                            <Typography className={classes.mobilePrimaryText}>Migrate to FASTSWAP</Typography>
                            <Button variant="contained"
                              style={{
                                backgroundColor: "#6BC08E", fontSize: 14, borderRadius: 8, padding: "4px 12px"
                              }} className={classes.comingsoon}>Coming soon</Button>
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem disabled button className={classes.listItem}>
                      <ListItemText
                        primary={<Typography className={classes.mobilePrimaryText}>Airdrop</Typography>}
                      />
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                      <ListItemText
                        primary={<Typography className={classes.mobilePrimaryText} onClick={() => openMyAccount()}>My Account</Typography>}
                      />
                    </ListItem>
                    <Divider className={classes.divider} />
                    <ListItem disabled button className={classes.listItem} style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <ListItemText
                        primary={<Typography className={classes.mobilePrimaryText}>About Us</Typography>}
                      />
                    </ListItem>
                    <ListItem style={{ paddingTop: 0, marginTop: 0 }}>
                      <IconButton onClick={() => openTwitter()}>
                        <img alt="icon" src={twitter_white} />
                      </IconButton>
                      <IconButton onClick={() => openTelegram()}>
                       <img alt="icon" src={telegram_white} />
                      </IconButton>
                      <Box style={{ flexGrow: 1 }} />
                      <IconButton onClick={toggleDarkMode} >
                        {darkMode ? <img alt="icon" src={Moon} /> : <img alt="icon" src={LightSun} />}
                      </IconButton>
                    </ListItem>
                  </List>
                </Box>
              </Dialog>

            </>
          }
          {!isMobile && <><Tabs
            value={activeTab}
            onChange={handleChangeTab}
            className={classes.tabList}
          >
            <Tab label="HOME" />
            <Tab label="SWAP" />
            <Tab label="POOL" />
            <Tab label="FARM" />
            <Tab label="FAST BAR" />
          </Tabs>
            <IconButton
              onMouseEnter={openProfileOptions}
              onMouseLeave={closeProfileOptions}
            >
              <img alt="icon" src={Apps} />
              <Popover
                open={Boolean(profileOptions)}
                anchorEl={profileOptions}
                onClose={() => closeProfileOptions()}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                disableRestoreFocus
                classes={{
                  paper: classes.popover
                }}
              >
                <List component="nav" onMouseLeave={closeProfileOptions} className={classes.dropMenu}>
                  <ListItem button className={classes.listItem} onClick={() => openServe()}>
                    <ListItemText
                      primary={<Typography className={classes.primaryText}>Serve</Typography>}
                      secondary={<Typography className={classes.secondaryText}>Convert Trading fees</Typography>}
                    />
                  </ListItem>
                  <ListItem button className={classes.listItem} onClick={() => openLaunchSpot()} disabled>
                    <ListItemText
                      primary={<Box style={{ display: "flex", alignItems: "center" }}><Typography className={classes.primaryText}>Launch Spot</Typography><LaunchIcon /></Box>}
                      secondary={<Typography className={classes.secondaryText}>Stake FAST to participate in IDO</Typography>}
                    />
                  </ListItem>
                  <ListItem button className={classes.listItem} disabled>
                    <ListItemText
                      primary={<Typography className={classes.primaryText}>Migrate to FASTSWAP</Typography>}
                      secondary={<Button variant="contained" className={classes.comingsoon}>Coming soon</Button>}
                    />
                  </ListItem>
                  <ListItem button className={classes.listItem} disabled>
                    <ListItemText
                      primary={<Typography className={classes.primaryText}>Airdrop</Typography>}
                    />
                  </ListItem>
                  <Divider className={classes.divider} />
                  <ListItem button className={classes.listItem} style={{paddingBottom:0, marginBottom:0}} disabled> 
                      <ListItemText 
                      primary={<Typography className={classes.primaryText}>About Us</Typography>} 
                      />
                  </ListItem>
                  <ListItem style={{ paddingTop: 0, marginTop: 0 }} >
                    <IconButton
                      onMouseEnter={() => setIsHover({ icon: "twitter", state: true })}
                      onMouseLeave={() => setIsHover({ icon: "twitter", state: false })}
                      onClick={() => openTwitter()}
                    >
                      {ishover.icon === "twitter" && ishover.state ? <img alt="icon" src={twitter_hover} /> : <img alt="icon" src={twitter} />}
                    </IconButton>
                    <IconButton
                      onMouseEnter={() => setIsHover({ icon: "telegram", state: true })}
                      onMouseLeave={() => setIsHover({ icon: "telegram", state: false })}
                      onClick={() => openTelegram()}
                    >
                      {ishover.icon === "telegram" && ishover.state ? <img alt="icon" src={telegram_hover} /> : <img alt="icon" src={telegram} />}
                    </IconButton>
                    
                  </ListItem>
                </List>
              </Popover>
            </IconButton>
            {/* <Button className={clsx(classes.button, classes.fastButton)}>
              FAST
            </Button> */}
            <Box style={{display: "flex", alignItems: "center"}}>
              <img alt="fasttoken" src={fasttoken} width="32px" height="32px" />
              <Typography style={{cursor: "default", fontSize: 16, fontWeight: 400, paddingLeft: 8, paddingRight: 24}}>$ {Number(fastprice).toFixed(2)}</Typography>
            </Box>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
            <IconButton onClick={toggleDarkMode} >
              {darkMode ? <img src={Moon} /> : <img src={Sun} />}
            </IconButton>
            <HideSmall>
              {chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
              )}
            </HideSmall></>}
        </Toolbar>
      </AppBar>
      {!isMobile && <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {/* <Scrollbars> */}
        <List className={classes.list}>
          <ListItem button
            className={clsx(classes.listItem, {
              [classes.active]: activeDrawer === "overview"
            })}
            onClick={() => {
              handleChange("overview")
            }}
          >
            <ListItemIcon className={classes.listItemIcon}>
              {/* <LanguageOutlinedIcon /> */}
              <img src={global} />
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary="Overview" />
          </ListItem>
          <ListItem button
            className={clsx(classes.listItem, {
              [classes.active]: activeDrawer === "tokens"
            })}
            onClick={() => handleChange("tokens")}
          >
            <ListItemIcon className={classes.listItemIcon}>
              {/* <AlbumOutlinedIcon /> */}
              <img src={album} />
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary="Tokens" />
          </ListItem>
          <ListItem button
            className={clsx(classes.listItem, {
              [classes.active]: activeDrawer === "pairs"
            })}
            onClick={() => handleChange("pairs")}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <img src={union} />
            </ListItemIcon>
            <ListItemText className={classes.listItemText} primary="Pairs" />
          </ListItem>
        </List>
        {/* </Scrollbars> */}
      </Drawer>}
    </>
    // <HeaderFrame>
    //   {/* <ClaimModal />
    //   <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
    //     <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
    //   </Modal> */}
    //   <HeaderRow>

    //     {/* <Title href=".">
    //       <UniIcon>
    //         <img height={'45px'} width={'auto'} src={isDark ? LogoDark : Logo} alt="logo" />
    //       </UniIcon>
    //     </Title> */}
    //     {/* <HeaderLinks>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Home
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Farms
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Shares
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Migrate
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Serve
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Charts
    //       </StyledExternalLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Help
    //       </StyledExternalLink>
    //     </HeaderLinks> */}
    //     {/* <HeaderLinks>
    //       <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
    //         {t('swap')}
    //       </StyledNavLink>
    //       <StyledNavLink
    //         id={`pool-nav-link`}
    //         to={'/pool'}
    //         isActive={(match, { pathname }) =>
    //           Boolean(match) ||
    //           pathname.startsWith('/add') ||
    //           pathname.startsWith('/remove') ||
    //           pathname.startsWith('/create') ||
    //           pathname.startsWith('/find')
    //         }
    //       >
    //         {t('pool')}
    //       </StyledNavLink>
    //       <StyledNavLink id={`stake-nav-link`} to={'/uni'}>
    //         UNI
    //       </StyledNavLink>
    //       <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
    //         Vote
    //       </StyledNavLink>
    //       <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
    //         Charts <span style={{ fontSize: '11px' }}>↗</span>
    //       </StyledExternalLink>
    //     </HeaderLinks> */}
    //   </HeaderRow>
    //   <HeaderControls>
    //     <HeaderElement>
    //       <HideSmall>
    //         {chainId && NETWORK_LABELS[chainId] && (
    //           <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
    //         )}
    //       </HideSmall>
    //       {/* {availableClaim && !showClaimPopup && (
    //         <UNIWrapper onClick={toggleClaimModal}>
    //           <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
    //             <TYPE.white padding="0 2px">
    //               {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
    //             </TYPE.white>
    //           </UNIAmount>
    //           <CardNoise />
    //         </UNIWrapper>
    //       )} */}
    //       {/* {!availableClaim && aggregateBalance && (
    //         <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
    //           <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
    //             {account && (
    //               <HideSmall>
    //                 <TYPE.white
    //                   style={{
    //                     paddingRight: '.4rem'
    //                   }}
    //                 >
    //                   <CountUp
    //                     key={countUpValue}
    //                     isCounting
    //                     start={parseFloat(countUpValuePrevious)}
    //                     end={parseFloat(countUpValue)}
    //                     thousandsSeparator={','}
    //                     duration={1}
    //                   />
    //                 </TYPE.white>
    //               </HideSmall>
    //             )}
    //             UNI
    //           </UNIAmount>
    //           <CardNoise />
    //         </UNIWrapper>
    //       )} */}
    //       {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
    //         {account && userEthBalance ? (
    //           <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
    //             {userEthBalance?.toSignificant(4)} ETH
    //           </BalanceText>
    //         ) : null}
    //         <Web3Status />
    //       </AccountElement> */}
    //     </HeaderElement>
    //     <HeaderElementWrap>
    //       {/* <Settings /> */}
    //       {/* <Menu /> */}
    //     </HeaderElementWrap>
    //   </HeaderControls>
    // </HeaderFrame>
  )
}
