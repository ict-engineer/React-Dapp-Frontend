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
import { environment } from '../../constants/environments/environment';
import { ApiService } from '../../hooks/api.service';
import { ApiWalletService } from '../../hooks/api-wallet.service';
import Spinner from '../../components/Spinner';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';

interface formProp {
    value: string,
}

const Serve = () => {
  const classes = useStyles.serve()
//   const isMobile = useMediaQuery('(max-width: 1024px)');
  const History = useHistory();
  const [chainId, setChainId] = useState<any>();
  const [userAccount, setUserAccount] = useState<any>();
  const [contractInstance, setContractInstance] = useState<any>();
  const [success, setSuccess] = useState<any>();
  const {walletId}:any = useParams();
  const [tokenform0, setTokenForm0] = useState<formProp>({
    value: environment.WETHaddress,
  })
  const [tokenform1, setTokenForm1] = useState<formProp>({
    value: '',
  })
  const { enqueueSnackbar } = useSnackbar();
  const apiservices = new ApiService();
  const apiwalletservice = new ApiWalletService();

  const checkConnected = async (walletId: any) => {
    if (walletId && walletId !== undefined) {
      let walletIdArray = ['1', '2'];
      if (!walletIdArray.includes(walletId)) {
        History.push('/swap')
      } else {

        if (walletId == '1') {
          let user_account: any = await apiservices.export();
          setUserAccount(user_account);
          if (user_account == undefined || !user_account.length) {
            History.push('/swap')
          } else {
            let contract_instance = await apiservices.exportInstance(environment.makerAddress, environment.commanABI);
            setContractInstance(contract_instance)
          }
        } else {
          apiwalletservice.getBehaviorView().subscribe(async (data:any) => {
            if (data && data != undefined) {
              if (data['connected'] && data['connected'] == true) {

                let networkName = data['networkName'];
                setUserAccount(data['walletAddress']);
                setChainId(data['chainId']);

                apiwalletservice.walletConnectInit();

                let contract_instance = await apiwalletservice.exportInstance(networkName, environment.makerAddress, environment.commanABI);
                setContractInstance(contract_instance)
              } else {
                History.push('/swap')
              }
            } else {
              History.push('/swap')
            }
          });
        }
      }
    }
  }
  const onClickSubmit = async () => {

    if (tokenform0.value === '' || tokenform1.value === '') {
        enqueueSnackbar('Fill in the token value.', { variant : "error" });
        return;
    } else {
      const regex = new RegExp('^0x[a-fA-F0-9]{40}$');

      let t0 = regex.test(tokenform0.value);
      let t1 = regex.test(tokenform1.value);

      if (t0 && t1) {

        let instance = contractInstance;

        let service: any = '';
        if (walletId == '1') {
          service = apiservices;
        } else {
          service = apiwalletservice;
        }

        await service.convert(instance, tokenform0.value, tokenform1.value, userAccount, chainId).then(async (receipt:any) => {
          console.log('receipt', receipt);
          if (receipt) {
            // this.success = 'https://etherscan.io/tx/' + receipt.transactionHash;
            setSuccess(environment.transactionLink + receipt.transactionHash)

            setTokenForm0(prevState => ({
                ...prevState,
                value: ''
            }))
            setTokenForm1(prevState => ({
                ...prevState,
                value: ''
            }))
            // this.onClickRefresh();
          }
        }).catch((er:any) => {
          if (er && er.code) {
            enqueueSnackbar(er.message, { variant : "error" });
            setTokenForm0(prevState => ({
                ...prevState,
                value: ''
            }))
            setTokenForm1(prevState => ({
                ...prevState,
                value: ''
            }))
          }
        });
      } else {
        enqueueSnackbar('Invalid Address', { variant : "error" });
      }
    }
  }
  const setToken0Value = (e:any) => {
    const val = e.target.value
    setTokenForm0(prevState => ({
      ...prevState, 
      value: val
    }))
  }
  const setToken1Value = (e:any) => {
    const val = e.target.value
    setTokenForm1(prevState => ({
      ...prevState, 
      value: val
    }))
  }
  useEffect(() => {
    checkConnected(walletId)
  }, [])
  return (
    <>
        {/* <Spinner isLoading={isLoading} /> */}
        <Box className={classes.topContainer}>
            <Typography style={{fontSize: 34, fontWeight: 300}}>Convert Trading fees</Typography>
            <Typography style={{fontSize: 16, fontWeight: 400, fontFamily: "Raleway"}}>This will share trading fee with all xFAST token holders.</Typography>
        </Box>
        <Box className={classes.mainContainer}>
            <Card className={classes.servePanel}>
                <Typography className={classes.infoTitle}>Token0</Typography>
                <Box className={classes.inputPanel}>
                    <TextField 
                        className={classes.input} 
                        variant="outlined"
                        onChange={(event: any) => { 
                            setToken0Value(event)
                        }}
                        value={tokenform0.value}
                    />
                </Box>
                <Typography className={classes.infoTitle} style={{paddingTop: 16}}>Token1</Typography>
                <Box className={classes.inputPanel}>
                    <TextField 
                        className={classes.input} 
                        variant="outlined"
                        onChange={(event: any) => { 
                            setToken1Value(event)
                        }}
                        value={tokenform1.value}
                    />
                </Box>
                <Button onClick={() => onClickSubmit()} className={classes.buttonStyle}>SUBMIT</Button>
            </Card>
            <Typography className={classes.serveWrapper}>
            Everytime a trade happens on FastSwap, 0.05% will go to the Fastmaker as fees. These fees are converted into FAST which is then distributed proportionally to all xFAST Token holders.
            </Typography>
        </Box>
   </>
  )
}

export default Serve
