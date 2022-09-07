import React, { useState, useEffect } from 'react'
import useStyles from '../../assets/styles'
import Box from '@material-ui/core/Box'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router';
import xfasttoken from '../../assets/images/xfasttoken.png'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { environment } from '../../constants/environments/environment';
import { ApiService } from '../../hooks/api.service';
import { ApiWalletService } from '../../hooks/api-wallet.service';
import { useSnackbar } from 'notistack';
import Spinner from '../../components/Spinner';
import { useAllTransactions } from '../../state/transactions/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import trans_swap from '../../assets/images/transactions/swap.svg'
import trans_deposit from '../../assets/images/transactions/receive.svg'
import trans_liquidity from '../../assets/images/transactions/receive.svg'
import trans_send from '../../assets/images/transactions/send.svg'
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getEtherscanLink } from '../../utils'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAllTokens } from '../../hooks/Tokens'
import { injected, walletconnect, walletlink, fortmatic, portis, lattice } from '../../connectors'

const Account = () => {
  const classes = useStyles.account()
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const History = useHistory();
  const { account, chainId, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // fetch the user's balances of all tracked V2 LP tokens
  const apiservices = new ApiService();
  const apiwalletservice = new ApiWalletService();
  const [earnings, setEarningValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [ethPrice, setETHPrice] = useState('');
  const [ethImage, setETHImage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [openmodal, setOpenModal] = useState(false);
  const [detailFrom, setDetailFrom] = useState('');
  const [detailTo, setDetailTo] = useState('');
  const [detailTitle, setDetailTitle] = useState('');
  const [detailHash, setDetailHash] = useState('');
  const allTokens = useAllTokens()
  const [valuedTokens, setValuedTokens] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  let total_value = 0;
  const openTransModal = (item: any, title: any) => {
    /// you can set states here.
    setDetailTitle(title)
    setDetailFrom((item.receipt as any).from)
    setDetailTo((item.receipt as any).to)
    setDetailHash(item.hash)
    setOpenModal(true);
  }
  const handleCloseModal = () => {
    setOpenModal(false);
  }
  const allTransactions = useAllTransactions()

  const isMetamask = window.ethereum //&& window.ethereum.isMetaMask
  let walletId = '0';
  if(isMetamask){
      walletId = '1';
  }else if(connector === walletconnect || connector === lattice || connector === walletlink || connector === fortmatic || connector === portis){
      walletId = '2';
  }
  const checkConnected = async (walletId: any) => {

    if (walletId && walletId != undefined) {
      let walletIdArray = ['1', '2'];
      if (!walletIdArray.includes(walletId)) {
        History.push('/swap');
        enqueueSnackbar('Please login the wallet.', { variant: "error" });
      } else {

        if (walletId == '1') {

          if (account == undefined || !account.length) {
            History.push('/swap');
            // setLoading(false)
            enqueueSnackbar('Please login the wallet.', { variant: "error" });
          } else {
            let xfast_instance = await apiservices.exportInstance(environment.xFastAddress, environment.commanABI);
            // xFAST to FAST
            await balanceOf1(xfast_instance, account, apiservices);
            //get tokens of account
            const allTokens_arr = Object.values(allTokens)
            const tmp_arr:any = []
            setLoading(false)
            for(let token in allTokens_arr) {
              let filterd_token = await apiservices.exportInstance(allTokens_arr[token].address, environment.commanABI);
              await apiservices.getBalance(filterd_token, account).then((data: any) => {
                if (data != 0) {
                  try {
                    axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${allTokens_arr[token].address}`)
                      .then(response => {
                        let detail_info = {
                          'address': allTokens_arr[token].address,
                          'balance': data,
                          'symbol': allTokens_arr[token].symbol,
                          'name': allTokens_arr[token].name,
                          'current_price': response.data.market_data.current_price.usd,
                          'image': response.data.image.small,
                          'value': Number(data) * Number(response.data.market_data.current_price.usd)
                        }
                        total_value += Number(detail_info.value)
                        setTotalValue(total_value)
                        // setValuedTokens(detail_info as any)
                        tmp_arr.push(detail_info)
                      })
                  } catch (e) {
                    console.log(`Axios request failed: ${e}`)
                  }
                }
              }).catch((er: any) => {
                // err code
              });
            }
            setValuedTokens(tmp_arr)
          }
        } else {
          apiwalletservice.getBehaviorView().subscribe(async (data: any) => {
            if (data && data != undefined) {
              if (data['connected'] && data['connected'] == true) {
                let user_account = data['walletAddress'];
                let network_name = data['networkName'];
                apiwalletservice.walletConnectInit();
                let xfast_instance = await apiwalletservice.exportInstance(network_name, environment.xFastAddress, environment.commanABI);
                // xFAST to FAST
                await balanceOf1(xfast_instance, user_account, apiwalletservice);
                //get tokens of account
                const allTokens_arr = Object.values(allTokens)
                const tmp_arr:any = []
                setLoading(false)
                for(let token in allTokens_arr) {
                  let filterd_token = await apiwalletservice.exportInstance(network_name, allTokens_arr[token].address, environment.commanABI);
                  await apiwalletservice.getBalance(filterd_token, user_account).then((data: any) => {
                    if (data != 0) {
                      try {
                        axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${allTokens_arr[token].address}`)
                          .then(response => {
                            let detail_info = {
                              'address': allTokens_arr[token].address,
                              'balance': data,
                              'symbol': allTokens_arr[token].symbol,
                              'name': allTokens_arr[token].name,
                              'current_price': response.data.market_data.current_price.usd,
                              'image': response.data.image.small,
                              'value': Number(data) * Number(response.data.market_data.current_price.usd)
                            }
                            total_value += Number(detail_info.value)
                            setTotalValue(total_value)
                            // setValuedTokens(detail_info as any)
                            tmp_arr.push(detail_info)
                          })
                      } catch (e) {
                        console.log(`Axios request failed: ${e}`)
                      }
                    }
                  }).catch((er: any) => {
                    // err code
                  });
                }
                setValuedTokens(tmp_arr)
                
              } else {
                History.push('/swap');
                enqueueSnackbar('Please login the wallet.', { variant: "error" });
              }
            } else {
              History.push('/swap');
              enqueueSnackbar('Please login the wallet.', { variant: "error" });
            }
          });;

        }


      }
    }

  }
  const balanceOf1 = async (contractInstance: any, walletAddress: any, service: any) => {
    service.getBalance(contractInstance, walletAddress).then((data: any) => {
      if (data != 0) {
        setEarningValue((parseFloat(data)).toFixed(6) as any)
      }
    }).catch((er: any) => {
      // err code
    });
  }
  useEffect(() => {
    checkConnected(walletId)
    try {
      axios.get(`https://api.coingecko.com/api/v3/coins/ethereum`)
        .then(response => {
          setETHPrice(response.data.market_data.current_price.usd)
          setETHImage(response.data.image.small)
        })
    } catch (e) {
      console.log(`Axios request failed: ${e}`)
    }
  }, []);
  return (
    <>
      <Spinner isLoading={isLoading} />
      <Box className={classes.pageContainer}>
        <Typography className={classes.pageTitle}>My Account</Typography>
        <Box className={classes.mainContainer}>
          <Box className={classes.tablePanel}>
            <Box>
              <Typography className={classes.mainTitle}>Balance</Typography>
              <Typography className={classes.valueFont}>US$ {Number(userEthBalance?.toSignificant(6)) * Number(ethPrice) ? (Number(userEthBalance?.toSignificant(6)) * Number(ethPrice) + totalValue).toFixed(6) : 0}</Typography>
            </Box>
            <Typography className={classes.mainTitle}>Tokens</Typography>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography className={classes.tableTitle}>Token Name</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className={classes.tableTitle}>Symbol</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className={classes.tableTitle}>Quantity</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className={classes.tableTitle}>Token Price</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className={classes.tableTitle}>Value in USD</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userEthBalance && 
                    <TableRow>
                      <TableCell>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <img alt="token" src={ethImage} width="32px" height="32px" style={{border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                          <Typography className={classes.tableValue} style={{ paddingLeft: 8 }}>Ethereum</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={classes.tableValue}>ETH</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={classes.tableValue}>{userEthBalance?.toSignificant(6) ? userEthBalance?.toSignificant(6) : 0}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={classes.tableValue}>${ethPrice}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={classes.tableValue}>${Number(userEthBalance?.toSignificant(6)) * Number(ethPrice) ? (Number(userEthBalance?.toSignificant(6)) * Number(ethPrice)).toFixed(6) : 0}</Typography>
                      </TableCell>
                    </TableRow>
                  }
                  {(valuedTokens && valuedTokens.length > 0) &&
                    valuedTokens.map(token => {
                      return (
                        <TableRow>
                          <TableCell>
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                              <img alt="token" src={(token as any).image} width="32px" height="32px" style={{border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                              <Typography className={classes.tableValue} style={{ paddingLeft: 8 }}>{(token as any).name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography className={classes.tableValue}>{(token as any).symbol}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography className={classes.tableValue}>{(token as any).balance ? (token as any).balance : 0}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography className={classes.tableValue}>${(token as any).current_price ? (token as any).current_price : 0}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography className={classes.tableValue}>${(token as any).value ? (token as any).value.toFixed(6) : 0}</Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Typography className={classes.mainTitle} style={{ paddingTop: 48 }}>Earnings (xFAST)</Typography>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <img alt="xfast" src={xfasttoken} width="32px" height="32px" />
              <Typography className={classes.xfastValue} style={{ paddingLeft: 8 }}>{earnings ? earnings : 0}</Typography>
            </Box>
          </Box>
          <Box className={classes.transactionPanel}>
            <Typography className={classes.mainTitle}>Transactions</Typography>
            {Object.values(allTransactions).length ?
              <List>
                {Object.values(allTransactions).map(item => {
                  let d = new Date(item.confirmedTime as any)
                  let date = d.toDateString()
                  let title = ''
                  let icon = trans_deposit;
                  if ((item.summary as string).includes('Swap')) {
                    title = 'Swap'
                    icon = trans_swap
                  } else if ((item.summary as string).includes('liquidity')) {
                    title = 'Add Liquidity'
                    icon = trans_liquidity
                  } else if ((item.summary as string).includes('deposit')) {
                    title = 'Deposit FAST'
                    icon = trans_deposit
                  } else if ((item.summary as string).includes('send')) {
                    title = 'Send'
                    icon = trans_send
                  }else {
                    title = (item.summary as string).split(' ')[0]
                    icon = trans_swap
                  }
                  return (
                    <ListItem onClick={() => openTransModal(item, title)} className={classes.listWrapper}>
                      <ListItemAvatar>
                        <img alt="trans" src={icon} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography className={classes.primaryTransTitle}>{title}</Typography>}
                        secondary={<Typography className={classes.secondTransTitle}>{date}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <Typography className={classes.secondTransTitle}>{item.summary}</Typography>
                        {/* <Typography className={classes.secondTransTitle}>From<Typography component="span" className={classes.secondTransTitle} style={{color: "#9DD1B2"}}> 0.002ETH</Typography> to <Typography component="span" className={classes.secondTransTitle} style={{color: "#9DD1B2"}}>0.002ETH</Typography></Typography> */}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List> :
              <Typography style={{ fontSize: 16, fontWeight: 400, fontFamily: "Raleway" }}>No Activity here yet...</Typography>}
          </Box>
        </Box>
      </Box>
      <Dialog open={openmodal} aria-labelledby="simple-dialog-title" onClose={handleCloseModal} classes={{ paper: classes.modalWrapper }}>
        <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
          <IconButton onClick={handleCloseModal} aria-label="close" >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className={classes.modalContainer}>
          <Typography className={classes.valueFont}>{detailTitle}</Typography>
          <Typography style={{ fontSize: 20, fontWeight: 400, color: "#2BA55D", paddingBottom: 24 }}>{'ETH <> FAST'}</Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ fontSize: 14, fontWeight: 500, opacity: "70%" }}>Details</Typography>
            <a target="_blank" href={getEtherscanLink(chainId!, detailHash, 'transaction')}>
              <OpenInNewIcon style={{ color: "#2BA55D" }} />
            </a>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
            <Typography style={{ fontSize: 12, fontWeight: 400, fontFamily: "Raleway" }}>From:{detailFrom ? detailFrom.substring(0, 10) + "..." : ''}</Typography>
            <ArrowForwardIosIcon />
            <Typography style={{ fontSize: 12, fontWeight: 400, fontFamily: "Raleway" }}>To:{detailTo ? detailTo.substring(0, 10) + "..." : ''}</Typography>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default Account
