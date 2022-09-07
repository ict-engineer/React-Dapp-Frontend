import React, {useState, useEffect} from "react";
import useStyles from "../../assets/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
// import Button from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';

import icon_switcher1 from "../../assets/images/icon_switcher1.svg";
import icon_switcher2 from "../../assets/images/icon_switcher2.svg";
import EtherToken from "../../assets/images/HDCOINS/ETH.jpg"
import FastToken from "../../assets/images/HDCOINS/FAST.jpg"
import MVPToken from "../../assets/images/HDCOINS/MVP.jpg"
import RFIToken from "../../assets/images/HDCOINS/RFI.jpg"
import USDCToken from "../../assets/images/HDCOINS/USDC.jpg"
import USDTToken from "../../assets/images/HDCOINS/USDT.jpg"
import DAIToken from "../../assets/images/HDCOINS/DAI.jpg"
import YFIToken from "../../assets/images/HDCOINS/YFI.jpg"
import WBTCToken from "../../assets/images/HDCOINS/WBTC.jpg"
import LINKToken from "../../assets/images/HDCOINS/LINK.jpg"
// import AAVEToken from "../../assets/images/HDCOINS/AAVE.jpg"
// import CompToken from "../../assets/images/HDCOINS/COMP.jpg"
// import SNXToken from "../../assets/images/HDCOINS/SNX.jpg"
// import UNIToken from "../../assets/images/HDCOINS/UNI.jpg"
// import SUSHIToken from "../../assets/images/HDCOINS/SUSHI.jpg"
// import KP3RToken from "../../assets/images/HDCOINS/KP3R.jpg"
// import BANDToken from "../../assets/images/HDCOINS/BAND.jpg"

import { ApiService } from '../../hooks/api.service';
import { ApiWalletService} from '../../hooks/api-wallet.service';
// import Spinner from '../../components/Spinner';
import { useHistory } from 'react-router-dom';
import { environment } from '../../constants/environments/environment';
import { useSnackbar } from 'notistack';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useActiveWeb3React } from '../../hooks'
import { injected, walletconnect, walletlink, fortmatic, portis, lattice } from '../../connectors'

const Farms = () => {
    const classes = useStyles.farms();
    const gridClasses = useStyles.grid();
    const [switcher, setSwitcher] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const [wallet, setWallet] = useState('');
    const { connector } = useActiveWeb3React()
    // const [walletId, setWalletId] = useState<any>();
    // const [userAccount, setUserAccount] = useState<any>();
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const apiservices = new ApiService();
    const apiwalletservice = new ApiWalletService();
    
    const checkConnected = async () => {
        // const walletId = ActivatedRoute.snapshot.params['walletId'];
        const isMetamask = window.ethereum //&& window.ethereum.isMetaMask
        let walletId = '0';
        if(isMetamask){
            walletId = '1';
        }else if(connector === walletconnect || connector === lattice || connector === walletlink || connector === fortmatic || connector === portis){
            walletId = '2';
        }
        // setWalletId(walletId);

        if (walletId && walletId !== undefined) {
          let idArray = ['1', '2'];
    
          if (!idArray.includes(walletId)) {
            //   history.push('swap');
              enqueueSnackbar('Please login the wallet.', { variant : "error" });
          } else {
            if (walletId === '1') {
              const userAccount = await apiservices.export();
    
              if (userAccount === undefined || !(userAccount as any).length) {
                // history.push('swap');
                enqueueSnackbar('Please login the wallet.', { variant : "error" });
              } else {
                // web3Metamask Connected
                setWallet('Metamask')
              }
            } else {
                apiwalletservice.getBehaviorView().subscribe((data:any) => {
                if (data && data !== undefined) {
                  if (data['connected'] && data['connected'] === true) {
                    setWallet('WalletConnect')
                    apiwalletservice.walletConnectInit();
                  } else {
                    // history.push('swap');
                  }
    
                } else {
                //   history.push('swap');
                }
              })
            }
    
          }
        }
    }
    const routeToMoversPlant = (pool:any) => {
        if (wallet === 'Metamask') {
          history.push('farms/'+pool+'/1');
        } else if (wallet === 'WalletConnect') {
          history.push('farms/'+pool+'/2');
        }else {
            enqueueSnackbar('Please login the wallet.', { variant : "error" });
        }
      }
    useEffect(() => {
        checkConnected()
    }, [])

    return(
        <Box className={classes.mainContainer}>
            <Box className={classes.topContainer}>
                <Box>
                    <Typography style={{fontSize: 34, fontWeight: 300}}>Stake your FLP Tokens and Earn Rewards</Typography>
                    <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>Earn FAST tokens by staking FastSwap FLP Tokens.</Typography>
                </Box>
                {!isMobile && <Box style={{display: "flex"}}>
                    <IconButton className={switcher === 0 ? classes.switcherActive : classes.switcher} onClick={() => setSwitcher(0)}><img alt="switcher1" src={icon_switcher1} width="32px" height="32px" /></IconButton>
                    <IconButton className={switcher === 1 ? classes.switcherActive : classes.switcher} onClick={() => setSwitcher(1)}><img alt="switcher2" src={icon_switcher2} width="32px" height="32px" /></IconButton>
                </Box>}
            </Box>
            {(switcher === 0 && !isMobile) && 
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography className={gridClasses.tableTitle}>Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography className={gridClasses.tableTitle}>Pair Tokens</Typography>
                            </TableCell>
                            {/* <TableCell align="right">
                                <Typography className={gridClasses.tableTitle}>Total Stake</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography className={gridClasses.tableTitle}>Network Share</Typography>
                            </TableCell> */}
                            <TableCell align="right">
                                <Typography className={gridClasses.tableTitle}>Annual Reward Rate</Typography>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow onClick={() => routeToMoversPlant('FAST-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>FAST Gang</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={FastToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>FAST</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('YFT-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>YFT Party</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={MVPToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>YFT</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('MVP-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>MVP Champ</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={MVPToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>MVP</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('FAST-RFI-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>RFI Inter</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={FastToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={RFIToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>FAST</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>RFI</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('USDC-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Stingy Joe</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={USDCToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>USDC</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('USDT-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Tether Mint</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={USDTToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>USDT</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('DAI-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Maker DAI</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={DAIToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>DAI</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('YFI-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>YFI Whale</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={YFIToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>YFI</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow><TableRow onClick={() => routeToMoversPlant('WBTC-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>BTC Smart</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={WBTCToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>WBTC</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('LINK-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Link Marin</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={LINKToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>LINK</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            {/* <TableRow onClick={() => routeToMoversPlant('AAVE-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Aave Juicy</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={AAVEToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>AAVE</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('COMP-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Compound Juicy</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={COMPToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>COMP</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('SNX-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Synthetic Green</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={SNXToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>SNX</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('UNI-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Unicorn</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={UNIToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>UNI</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('SUSHI-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>SUSHI SUSHI</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={SUSHIToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>SUSHI</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('KP3R-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>KP3R Bull</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={KP3RToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>KP3R</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow onClick={() => routeToMoversPlant('BAND-ETH-FLP')}>
                                <TableCell>
                                    <Typography style={{fontWeight: 400, fontSize: 16}}>Band Party</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box style={{display: 'flex', alignItems: 'center'}}>
                                        <img alt="tokenfast" className={classes.tokenStyle} src={BANDToken} width="32px" height="32px" />
                                        <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="32px" height="32px" style={{marginLeft: "-8px", marginRight: "8px"}} />
                                        <Typography className={classes.pairToken}>BAND</Typography>
                                        <ClearIcon style={{color: "#2BA55D"}} />
                                        <Typography className={classes.pairToken}>ETH</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography>{Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerYear) * 1000000) / 1000000}</Typography>
                                </TableCell>
                            </TableRow> */}
                        
                        </TableBody>
                    </Table>
                </TableContainer>
            }{(switcher === 1 || isMobile) && 
                <Grid container spacing={3} style={{marginTop: 44}}>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('FAST-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Fast Gang</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>FAST-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={FastToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />                            
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('YFT-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>YFT Party</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>YFT-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={MVPToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('MVP-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>MVP Champ</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>MVP-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={MVPToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('FAST-RFI-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>RFI Inter</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>FAST-RFI</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={FastToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={RFIToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('USDC-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Stingy Joe</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>USDC-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={USDCToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('USDT-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Tether Mint</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>USDT-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={USDTToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('DAI-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Maker DAI</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>DAI-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={DAIToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('YFI-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>YFI Whale</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>YFI-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={YFIToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('WBTC-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>BTC Smart</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>BTC-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={WBTCToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('LINK-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Link Marin</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>LINK-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={LINKToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    {/* <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('AAVE-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Aave Juicy</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>AAVE-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={AAVEToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('COMP-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Compound Juicy</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>COMP-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={CompToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('SNX-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Synthetic Green</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>SNX-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={SNXToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('UNI-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Unicorn</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>UNI-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={UNIToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('SUSHI-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>SUSHI SUSHI</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>SUSHI-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={SUSHIToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('KP3R-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>KP3R Bull</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>KP3R-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={KP3RToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Box className={classes.tokenPanel} onClick={() => routeToMoversPlant('BAND-ETH-FLP')}>
                            <Box>
                                <Typography style={{fontSize: 24, fontWeight: 500}}>Band Party</Typography>
                                <Typography style={{fontSize: 14, fontWeight: 500, fontFamily: "Raleway"}}>BAND-ETH</Typography>
                            </Box>
                            <Box>
                                <img alt="tokenfast" className={classes.tokenStyle} src={BANDToken} width="40px" height="40px" style={{marginTop: "16px"}} />
                                <img alt="tokenfast" className={classes.tokenStyle} src={EtherToken} width="40px" height="40px" style={{marginLeft: "-8px", marginRight: "8px"}} />    
                            </Box>
                        </Box>
                    </Grid> */}

                </Grid>
            }
        </Box>
    )
}

export default Farms;