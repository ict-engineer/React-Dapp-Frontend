import React, { useState, useEffect } from 'react'
import clsx from "clsx";
import useStyles from '../../assets/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Card from '@material-ui/core/Card'
import Dialog from '@material-ui/core/Dialog';
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router';
import fasttoken from '../../assets/images/landing/fasttoken.png'
import xfasttoken from '../../assets/images/xfasttoken.png'
import { environment } from '../../constants/environments/environment';
import { ApiService } from '../../hooks/api.service';
import { ApiWalletService } from '../../hooks/api-wallet.service';
import Spinner from '../../components/Spinner';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';

interface formProp {
    amount: string,
    value: number,
}
const FastBar = () => {
  const classes = useStyles.fastbar()
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [openEnter, setOpenEnter] = useState(false);
  const [userAccount, setUserAccount] = useState<any>();
  const [chainId, setChainId] = useState<any>();
  const [balance1, setBalance1] = useState<number>(0);
  const [balance2, setBalance2] = useState<number>(0);
  const [approved2, setApproved2] = useState<number>(0);
  const [isLoading, setLoading] = useState(true);
  const [fastInstance, setFastInstance] = useState<any>();
  const [barInstance, setBarInstance] = useState<any>();
  const History = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const {walletId}:any = useParams();
  let show2 = 'approve'
  const [approve2form, setApprove2Form] = useState<formProp>({
    amount: '',
    value: 0,
  })
  const [stake2form, setStake2Form] = useState<formProp>({
      amount: '',
      value: 0
  })
  const [leaveform, setLeaveForm] = useState<formProp>({
      amount: '',
      value: 0
  })
  const apiservices = new ApiService();
  const apiwalletservice = new ApiWalletService();

  const openDepositModal = () => {
    setOpenDeposit(true);
  }
  const handleCloseDeposit = () => {
    setOpenDeposit(false);
    setStake2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
    setApprove2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
  }
  const openEnterModal = () => {
    setOpenEnter(true);
  }
  const handleCloseEnter = () => {
    setOpenEnter(false);
    setStake2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
    setApprove2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
  }
  const openLeaveModal = () => {
    setOpenLeave(true);
  }
  const handleCloseLeave = () => {
    setOpenLeave(false);
    setStake2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
    setApprove2Form(prevState => ({
        ...prevState,
        amount: '',
        value: 0
    }))
  }

  const checkConnected = async (walletId:any) => {

    if (walletId && walletId != undefined) {
      let walletIdArray = ['1', '2'];
      if (!walletIdArray.includes(walletId)) {
        // History.push('/swap');
        enqueueSnackbar('Please login the wallet.', { variant : "error" });
      } else {

        if (walletId == '1') {

          let user_account: any = await apiservices.export();
          setUserAccount(user_account);

          if (user_account == undefined || !user_account.length) {
            // History.push('/swap');
            setLoading(false)
            enqueueSnackbar('Please login the wallet.', { variant : "error" });
          } else {

            let fast_instance = await apiservices.exportInstance(environment.fastAddress, environment.commanABI);
            setFastInstance(fast_instance);
            let xfast_instance = await apiservices.exportInstance(environment.xFastAddress, environment.commanABI);
            let bar_instance = await apiservices.exportInstance(environment.barAddress, environment.commanABI);
            setBarInstance(bar_instance);
            // xFAST to FAST
            await balanceOf1(xfast_instance, user_account, apiservices);

            // FAST to xFAST
            await balanceOf2(fast_instance, user_account, apiservices);
            await allowance2(fast_instance, user_account, environment.barAddress, apiservices);

            setLoading(false)
          }
        } else {
          apiwalletservice.getBehaviorView().subscribe(async (data:any) => {
            if (data && data != undefined) {
              if (data['connected'] && data['connected'] == true) {

                let network_name = data['networkName'];
                // setNetworkName(data['networkName'])
                let user_account = data['walletAddress'];
                setUserAccount(data['walletAddress'])
                // let chain_id = data['chainId'];
                setChainId(data['chainId'])

                apiwalletservice.walletConnectInit();


                let fast_instance = await apiwalletservice.exportInstance(network_name, environment.fastAddress, environment.commanABI);
                setFastInstance(fast_instance)
                let xfast_instance = await apiwalletservice.exportInstance(network_name, environment.xFastAddress, environment.commanABI);
                let bar_instance = await apiwalletservice.exportInstance(network_name, environment.barAddress, environment.commanABI);
                setBarInstance(bar_instance)
                // xFAST to FAST
                await balanceOf1(xfast_instance, user_account, apiwalletservice);

                // FAST to xFAST
                await balanceOf2(fast_instance, user_account, apiwalletservice);
                await allowance2(fast_instance, user_account, environment.barAddress, apiwalletservice);

                setLoading(false)
              } else {
                // History.push('/swap');
                enqueueSnackbar('Please login the wallet.', { variant : "error" });
              }
            } else {
              // History.push('/swap');
              enqueueSnackbar('Please login the wallet.', { variant : "error" });
            }
          });;

        }


      }
    }

  }
  useEffect(() => {
    checkConnected(walletId)
  }, [])
  // for balance GET
  const balanceOf2 = async (contractInstance:any, walletAddress:any, service:any) => {
    service.getBalance(contractInstance, walletAddress).then((data: any) => {
      if (data != 0) {
        setBalance2((parseFloat(data)).toFixed(6) as any)
      }
    }).catch((er:any) => {
      // err code
    });
  }
  const onClickApprove2Max = () => {
    setApprove2Form(prevState => ({
        ...prevState, 
        amount: balance2 as any,
        value: balance2,
    }))
  }
  const checkApprove2Amt = (e:any) => {
    let value = e.target.value
    if (value) {
      if (parseFloat(value) <= balance2) {

        if (parseFloat(value) < 0) {
          setApprove2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
          enqueueSnackbar('Amount: Must be value greater than 0.', { variant : "info" });
        } else {

        }
      } else {
        setApprove2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
        }))
          enqueueSnackbar('You do not have enough balance.', { variant : "info" });
      }
    }
  }
  const onClickApprove2 = async () => {
    if (approve2form.amount === '') {
      return;
    } else {

      let address = userAccount;
      let instance = fastInstance;

      let service: any = '';
      if (walletId == '1') {
        service = apiservices;
      } else {
        service = apiwalletservice;
      }

      address = environment.barAddress;

    // setLoading(true)
      await service.approve(instance, address, approve2form.value, userAccount, chainId).then((receipt:any) => {
        // setLoading(false)
        if (receipt) {

          show2 = 'stake';
          setApprove2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
          onClickRefresh();

        }
      }).catch((er:any) => {
        // setLoading(false)
        if (er && er.code) {
          setApprove2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
        } else {
          enqueueSnackbar(er.message, { variant : "error" });
          setApprove2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
        }
      })

    }
  }
  const allowance2 = async (contractInstance:any, walletAddress:any, contractAddress:any, service:any) => {
    await service.allowance(contractInstance, walletAddress, contractAddress,).then(async (data: any) => {
      data = parseFloat(data);

      if (data && data != NaN && data > 0) {
        setApproved2((data).toFixed(6))
        show2 = 'stake';
      } else {
        // this.approved = 0;
      }
    }).catch((er:any) => {
      // err code
    });
  }
  const checkStake2Amt = (e:any) => {
    let value = e.target.value
    if (value) {
      if (parseFloat(value) <= approved2) {
        if (parseFloat(value) < 0) {
          setStake2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
        }))
          enqueueSnackbar('Amount: Must be value greater than 0.', { variant : "info" });
        } else {

        }
      } else {
        setStake2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
        }))
          enqueueSnackbar('You do not have enough balance.', { variant : "info" });
      }
    }

  }
  const onClickStake2Max = () => {
    setStake2Form(prevState => ({
        ...prevState, 
        amount: approved2 as any,
        value: approved2,
    }))
  }
  const onClickStack2 = async () => {
    if (stake2form.amount === '') {
      return;
    } else {

      let instance = barInstance;

      let service: any = '';
      if (walletId == '1') {
        service = apiservices;
      } else {
        service = apiwalletservice;
      }
      // setLoading(true)

      await service.enter(instance, stake2form.value, userAccount, chainId).then(async (receipt:any) => {
        // setLoading(false)
        if (receipt) {
          setStake2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
          onClickRefresh();
        }
      }).catch((er:any) => {
        // setLoading(false)
        if (er && er.code) {
          enqueueSnackbar(er.message, { variant : "info" });
          setStake2Form(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
        }
      });
    }

  }
  // for balance GET
  const balanceOf1 = async (contractInstance:any, walletAddress:any, service:any) => {
    service.getBalance(contractInstance, walletAddress).then((data: any) => {
      if (data != 0) {
        setBalance1((parseFloat(data)).toFixed(6) as any)
      }
    }).catch((er:any) => {
      // err code
    });
  }
  const checkLeaveAmt = (e:any) => {
    let value = e.target.value
    if (value) {
      if (parseFloat(value) <= balance1) {
        if (parseFloat(value) < 0) {
          setLeaveForm(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
        }))
          enqueueSnackbar('Amount: Must be value greater than 0.', { variant : "info" });
        } else {

        }
      } else {
        setLeaveForm(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
        }))
          enqueueSnackbar('You do not have enough balance.', { variant : "info" });
      }
    }

  }
  const onClickLeaveMax = () => {
    setLeaveForm(prevState => ({
        ...prevState, 
        amount: balance1 as any,
        value: balance1,
    }))
  }
  const onClickLeave = async () => {
    if (leaveform.amount === '') {
      return;
    } else {

      let instance = barInstance;

      let service: any = '';
      if (walletId == '1') {
        service = apiservices;
      } else {
        service = apiwalletservice;
      }
      // setLoading(true)
      await service.leave(instance, leaveform.value, userAccount, chainId).then(async (receipt:any) => {
        // setLoading(false)
        if (receipt) {
            setLeaveForm(prevState => ({
                ...prevState, 
                amount: '',
                value: 0,
            }))
            onClickRefresh();
        }
      }).catch((er:any) => {
        // setLoading(false)
        if (er && er.code) {
          enqueueSnackbar(er.message, { variant : "info" });
          setLeaveForm(prevState => ({
            ...prevState, 
            amount: '',
            value: 0,
          }))
        }
      });
    }
  }
  const onClickRefresh = () => {
    window.location.reload();
  }
  const setApproveValue = (e:any) => {
    const val = e.target.value
    setApprove2Form(prevState => ({
      ...prevState, 
      amount: val,
      value: val
    }))
  }
  const setStakeValue = (e:any) => {
    const val = e.target.value
    setStake2Form(prevState => ({
      ...prevState, 
      amount: val,
      value: val
    }))
  }
  const setLeaveValue = (e:any) => {
    const val = e.target.value
    setLeaveForm(prevState => ({
      ...prevState, 
      amount: val,
      value: val
    }))
  }
  return (
    <>
        <Spinner isLoading={isLoading} />
        <Box className={classes.topContainer}>
            <Typography style={{fontSize: 34, fontWeight: 300}}>Stake FAST to Earn Trading Fees</Typography>
            <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>Once you stake FAST Token, you are eligible to receive a 0.05% platform fee share</Typography>
        </Box>
        <Box className={classes.mainContainer}>
            {/* <Box className={classes.chartPanel}>
                Platform Trading Volume
                
            </Box> */}
            <Card className={classes.fastbarPanel}>
                <Typography className={classes.infoTitle}>Your wallet</Typography>
                <Box style={{ display: "flex", justifyContent: "space-between", paddingBottom: 32 }}>
                    <Box style={{ display: "flex", alignItems: 'center' }}>
                        <img alt="fast" src={fasttoken} width="48px" height="48px" style={{ borderRadius: "50px", border: "1px solid #d4d4d4" }} />
                        <Typography className={classes.fastbarFont}>FAST</Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.fastbarFont}>{balance2 ? balance2 : 0}</Typography>
                    </Box>
                </Box>
                <Typography className={classes.infoTitle}>xFAST Earned</Typography>
                <Box style={{ display: "flex", justifyContent: "space-between", paddingBottom: 32 }}>
                    <Box style={{ display: "flex", alignItems: 'center' }}>
                        <img alt="xfast" src={xfasttoken} width="48px" height="48px" style={{ borderRadius: "50px", border: "1px solid #d4d4d4" }} />
                        <Typography className={classes.fastbarFont}>xFAST</Typography>
                    </Box>
                    <Box>
                        <Typography className={classes.fastbarFont}>{balance1 ? balance1 : 0}</Typography>
                    </Box>
                </Box>
                <Box style={{display: "flex", justifyContent: "space-between"}}>
                    {show2 === 'approve' && <Button onClick={openDepositModal} disabled = {balance2 === 0 ? true : false} className={
                        clsx({
                            [classes.disabledButton]: balance2 === 0,
                            [classes.activedButton]: balance2 !== 0
                        })}>APPROVE</Button>}
                    {show2 !== 'approve' && <Button onClick={openEnterModal} className={classes.activedButton}>STAKE</Button>}

                    <Button onClick={openLeaveModal} disabled = {balance1 === 0 ? true : false} className={
                        clsx({
                            [classes.disabledButton]: balance1 === 0,
                            [classes.activedButton]: balance1 !== 0
                        })}>CONVERT</Button>
                </Box>
            </Card>
        </Box>
        <Dialog open={openDeposit} aria-labelledby="simple-dialog-title" onClose={handleCloseDeposit} classes={{ paper: classes.modalWrapper }}>
            <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
                <IconButton onClick={handleCloseDeposit} aria-label="close" >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box className={classes.modalContainer}>
                <Typography className={classes.mainTitle}>Deposit FAST Tokens</Typography>
                <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>{balance2 ? balance2 :0} FAST Available</Typography>
                <Box className={classes.inputPanel}>
                    <TextField 
                        className={classes.input} 
                        variant="outlined"
                        placeholder='0'
                        onKeyUp={(event: any) => { 
                            checkApprove2Amt(event)
                        }}
                        onChange={(event: any) => { 
                            setApproveValue(event)
                        }}
                        value={approve2form.amount}
                    />
                    <Button onClick={() => onClickApprove2Max()} className={classes.maxStyle}>MAX</Button>
                </Box>
                <Button onClick={() => onClickApprove2()} className={classes.approveStyle}>CONFIRM</Button>
            </Box>
        </Dialog>
        <Dialog open={openEnter} aria-labelledby="simple-dialog-title" onClose={handleCloseEnter} classes={{ paper: classes.modalWrapper }}>
            <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
                <IconButton onClick={handleCloseEnter} aria-label="close" >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box className={classes.modalContainer}>
                <Typography className={classes.mainTitle}>Stake FAST to earn network fee</Typography>
                <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>{approved2 ? approved2 :0} FAST Available</Typography>
                <Box className={classes.inputPanel}>
                    <TextField 
                        className={classes.input} 
                        variant="outlined"
                        placeholder='0'
                        onKeyUp={(event: any) => { 
                            checkStake2Amt(event)
                        }}
                        onChange={(event: any) => { 
                            setStakeValue(event)
                        }}
                        value={stake2form.amount}
                    />
                    <Button onClick={() => onClickStake2Max()} className={classes.maxStyle}>MAX</Button>
                </Box>
                <Button onClick={() => onClickStack2()}className={classes.approveStyle}>CONFIRM</Button>
            </Box>
        </Dialog>
        <Dialog open={openLeave} aria-labelledby="simple-dialog-title" onClose={handleCloseLeave} classes={{ paper: classes.modalWrapper }}>
            <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
                <IconButton onClick={handleCloseLeave} aria-label="close" >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box className={classes.modalContainer}>
                <Typography className={classes.mainTitle}>Convert xFAST to FAST Tokens</Typography>
                <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>{balance1 ? balance1 :0} xFAST Available</Typography>
                <Box className={classes.inputPanel}>
                    <TextField 
                        className={classes.input} 
                        variant="outlined"
                        placeholder='0'
                        onKeyUp={(event: any) => { 
                            checkLeaveAmt(event)
                        }}
                        onChange={(event: any) => { 
                            setLeaveValue(event)
                        }}
                        value={leaveform.amount}
                    />
                    <Button onClick={() => onClickLeaveMax()} className={classes.maxStyle}>MAX</Button>
                </Box>
                <Button onClick={() => onClickLeave()} className={classes.approveStyle}>CONFIRM</Button>
            </Box>
        </Dialog>
    </>
  )
}

export default FastBar
