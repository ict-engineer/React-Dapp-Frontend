import React, { useState, useEffect } from 'react'
import useStyles from '../../assets/styles'
import Box from '@material-ui/core/Box'
import clsx from "clsx";
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
// import bg_farmdetail from '../../assets/images/bg_farmdetail.png';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Dialog from '@material-ui/core/Dialog';
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';

import BigNumber from '../../assets/bignumber.js/bignumber';
import { environment } from '../../constants/environments/environment';
import { ApiService } from '../../hooks/api.service';
import { ApiWalletService } from '../../hooks/api-wallet.service';
import Spinner from '../../components/Spinner';
interface stakeForm {
  amount: string,
  value: number,
}

interface showObjProp {
  approved: number,
  staked: number,
  earned: number,
  balance: number,
  totalSupply: number,
  networkshare: number,
  perHour: number,
  perDay: number,
  perWeek: number,
  perYear: number,
  earnHour: number,
  earnDay: number,
  earnWeek: number,
  earnYear: number,
  image1: string,
  image2: string,
  title: string,
  subTitle: string,
  deposit: string,
  earn: string,
  name: string,
  address: string,
  decimal: number,
  divideValue: any,
}
const Farm_detail = () => {
    const classes = useStyles.farmdetail()
    const { enqueueSnackbar } = useSnackbar();
    
    const [showObj, setShowObj] = useState<showObjProp>({
        approved: 0,
        staked: 0,
        earned: 0,
        balance: 0,
        totalSupply: 0,
        networkshare: 0,
        perHour: 0,
        perDay: 0,
        perWeek: 0,
        perYear: 0,
        earnHour: 0,
        earnDay: 0,
        earnWeek: 0,
        earnYear: 0,
        image1: '',
        image2: '',
        title: '',
        subTitle: '',
        deposit: '',
        earn: '',
        name: '',
        address: '',
        decimal: 18,
        divideValue: environment.divideValue,
    });
    const [openStake, setOpenStake] = useState(false);
    const [openUnstake, setOpenUnStake] = useState(false);
    const [userAccount, setUserAccount] = useState<any>();
    const [chainId, setChainId] = useState<any>();
    const [networkName, setNetworkName] = useState<any>();
    const [stakeInstance, setStakeInstance] = useState<any>();
    const [lpInstance, setlpInstance] = useState<any>();
    // const [submitted1, setSubmitted1] = useState(false);
    // const [submitted2, setSubmitted2] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [stake, setStake] = useState<stakeForm>({
      amount: '',
      value: 0,
    })
    const [unstake, setUnStake] = useState<stakeForm>({
      amount: '',
      value: 0,
    })

    const History = useHistory();
    const openStakeModal = () => {
        setOpenStake(true);
    }
    const handleClose1 = () => {
      setOpenStake(false);
      // setSubmitted1(false)
      // setSubmitted2(false)
      setStake(prevState => ({
        ...prevState, 
        amount: '',
        value: 0,
      }))
      setUnStake(prevState => ({
        ...prevState, 
        amount: '',
        value: 0,
      }))
    };
    const openUnStakeModal = () => {
        setOpenUnStake(true);
    }
    const handleClose2 = () => {
      setOpenUnStake(false);
      // setSubmitted1(false)
      // setSubmitted2(false)
      setStake(prevState => ({
        ...prevState, 
        amount: '',
        value: 0,
      }))
      setUnStake(prevState => ({
        ...prevState, 
        amount: '',
        value: 0,
      }))
    };
    let staked_value = 0
    const apiservices = new ApiService();
    const apiwalletservice = new ApiWalletService();

    const params:any = useParams();
    const id:string = params.Id;
    const walletId:string = params.walletId;

    const checkConnected = async (id: any, walletId: any) => {
        if (id && id !== undefined && walletId && walletId !== undefined) {
            let walletIdArray = ['1', '2']
            if (!walletIdArray.includes(walletId)) {
                History.push('swap')
            } else {
                if (walletId === '1') {
                    let user_account: any = await apiservices.export();
                    setUserAccount(user_account);
                    if (user_account === undefined || !user_account.length) {
                        History.push('swap')
                    } else {
                        // put the metamask code.
                        let idArray = [environment.FAST_ETH_FLP, environment.YFT_ETH_FLP, environment.MVP_ETH_FLP, environment.FAST_RFI_FLP, environment.USDC_ETH_FLP, environment.USDT_ETH_FLP, environment.DAI_ETH_FLP, environment.YFI_ETH_FLP,
                        environment.WBTC_ETH_FLP, environment.LINK_ETH_FLP, environment.AAVE_ETH_FLP, environment.COMP_ETH_FLP, environment.SNX_ETH_FLP, environment.UNI_ETH_FLP, environment.SUSHI_ETH_FLP, environment.KP3R_ETH_FLP, environment.BAND_ETH_FLP];

                        if (!idArray.includes(id)) {
                            History.push('swap/' + walletId);
                        } else {
                              metaMaskConnected(id, user_account);
                        }
                    }

                } else {
                    apiwalletservice.getBehaviorView().subscribe(async (data: any) => {
                        if (data && data !== undefined) {
                            if (data['connected'] && data['connected'] === true) {
                                setNetworkName(data['networkName'])
                                setUserAccount(data['walletAddress'])
                                setChainId(data['chainId'])              // put the walletConnect code.
                                apiwalletservice.walletConnectInit();

                                let idArray = [environment.FAST_ETH_FLP, environment.YFT_ETH_FLP, environment.MVP_ETH_FLP, environment.FAST_RFI_FLP, environment.USDC_ETH_FLP, environment.USDT_ETH_FLP, environment.DAI_ETH_FLP, environment.YFI_ETH_FLP,
                                environment.WBTC_ETH_FLP, environment.LINK_ETH_FLP, environment.AAVE_ETH_FLP, environment.COMP_ETH_FLP, environment.SNX_ETH_FLP, environment.UNI_ETH_FLP, environment.SUSHI_ETH_FLP, environment.KP3R_ETH_FLP, environment.BAND_ETH_FLP];

                                if (!idArray.includes(id)) {
                                    History.push('farm/' + walletId)
                                } else {
                                    walletConnected(id, data['walletAddress']);
                                }

                            } else {
                                History.push('swap')
                            }
                        } else {
                            History.push('swap')
                        }
                    })
                }
            }

        } else {
            History.push('swap')
        }
    }
    useEffect(() => {
      // checkConnected(id, walletId);
      setInterval(() => {
          checkConnected(id, walletId);
      }, 3000)
    }, [])
    const walletConnected = async (id:any, userAccount:any) => {
        if (id === environment.FAST_ETH_FLP) {
          console.log('-------meta ---1')        
          setShowObj(prevState => ({
            ...prevState, 
            title: 'FAST Gang ',
            subTitle: 'Deposit FAST-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'FAST-ETH FLP Tokens Staked',
            image1: '/HDCOINS/FAST.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.FAST_ETH_FLP.replace('-FL', " FL"),
            address: environment.FASTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          // 
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool1, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.FASTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool1, apiwalletservice);

          let per_hour = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
    
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
        } else if (id === environment.YFT_ETH_FLP) {
          setShowObj(prevState => ({
            ...prevState, 
            title: 'YFT Party ',
            subTitle: 'Deposit YFT-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'YFT-ETH FLP Tokens Staked',
            image1: '/HDCOINS/MVP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.YFT_ETH_FLP.replace('-FL', " FL"),
            address: environment.YFTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool2, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.YFTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool2, apiwalletservice);
          
          let per_hour = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---2')
        } else if (id === environment.MVP_ETH_FLP) {
          
          
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'MVP Champ',
            subTitle: 'Deposit MVP-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'MVP-ETH FLP Tokens Staked',
            image1: '/HDCOINS/MVP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.MVP_ETH_FLP.replace('-FL', " FL"),
            address: environment.MVPETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool3, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.MVPETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool3, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---3')
        } else if (id === environment.FAST_RFI_FLP) {
          
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'RFI Inter',
            subTitle: 'Deposit FAST-RFI FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'FAST-RFI FLP Tokens Staked',
            image1: '/HDCOINS/FAST.jpg',
            image2: '/HDCOINS/RFI.jpg',
            name: environment.FAST_RFI_FLP.replace('-FL', " FL"),
            address: environment.FASTRFIFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool4, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.FASTRFIFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool4, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---4')
        } else if (id === environment.USDC_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Stingy Joe',
            subTitle: 'Deposit USDC-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'USDC-ETH FLP Tokens Staked',
            image1: '/HDCOINS/USDC.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.USDC_ETH_FLP.replace('-FL', " FL"),
            address: environment.USDCETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool5, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.USDCETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool5, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---5')
        } else if (id === environment.USDT_ETH_FLP) {
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Tether Mint ',
            subTitle: 'Deposit USDT-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'USDT-ETH FLP Tokens Staked',
            image1: '/HDCOINS/USDT.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.USDT_ETH_FLP.replace('-FL', " FL"),
            address: environment.USDTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool6, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.USDTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool6, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---6')
        } else if (id === environment.DAI_ETH_FLP) {
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Maker DAI ',
            subTitle: 'Deposit DAI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'DAI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/DAI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.DAI_ETH_FLP.replace('-FL', " FL"),
            address: environment.DAIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
          
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool7, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.DAIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool7, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---7')
        } else if (id === environment.YFI_ETH_FLP) {
          
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'YFI Whale',
            subTitle: 'Deposit YFI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'YFI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/YFI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.YFI_ETH_FLP.replace('-FL', " FL"),
            address: environment.YFIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool8, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.YFIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool8, apiwalletservice);
    
    
          let per_hour = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---8')
        } else if (id === environment.WBTC_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'BTC Smart',
            subTitle: 'Deposit WBTC-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'WBTC-ETH FLP Tokens Staked',
            image1: '/HDCOINS/WBTC.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.WBTC_ETH_FLP.replace('-FL', " FL"),
            address: environment.WBTCETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool9, environment.farmsABI);
          setStakeInstance(stake_instance)
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.WBTCETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool9, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---9')
        } else if (id === environment.LINK_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Link Marin ',
            subTitle: 'Deposit LINK-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'LINK-ETH FLP Tokens Staked',
            image1: '/HDCOINS/LINK.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.LINK_ETH_FLP.replace('-FL', " FL"),
            address: environment.LINKETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool10, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.LINKETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool10, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---10')
        } else if (id === environment.AAVE_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Aave Juicy ',
            subTitle: 'Deposit AAVE-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'AAVE-ETH FLP Tokens Staked',
            image1: '/HDCOINS/AAVE.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.AAVE_ETH_FLP.replace('-FL', " FL"),
            address: environment.AAVEETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool11, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.AAVEETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool11, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---11')
    
        } else if (id === environment.COMP_ETH_FLP) {
          
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Compound Juicy ',
            subTitle: 'Deposit COMP-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'COMP-ETH FLP Tokens Staked',
            image1: '/HDCOINS/COMP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.COMP_ETH_FLP.replace('-FL', " FL"),
            address: environment.COMPETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool12, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.AAVEETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool12, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---12')
        } else if (id === environment.SNX_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Synthetic Green',
            subTitle: 'Deposit SNX-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'SNX-ETH FLP Tokens Staked',
            image1: '/HDCOINS/SNX.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.SNX_ETH_FLP.replace('-FL', " FL"),
            address: environment.SNXETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool13, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.SNXETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool13, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---13')
        } else if (id === environment.UNI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Unicorn',
            subTitle: 'Deposit UNI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'UNI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/UNI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.UNI_ETH_FLP.replace('-FL', " FL"),
            address: environment.UNIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool14, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.UNIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool14, apiwalletservice);
    
    
          let per_hour = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---14')
        } else if (id === environment.SUSHI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'SUSHI SUSHI',
            subTitle: 'Deposit SUSHI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'SUSHI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/SUSHI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.SUSHI_ETH_FLP.replace('-FL', " FL"),
            address: environment.SUSHIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool15, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.SUSHIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool15, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
    
          setLoading(false)
    
          console.log('-------metat ---15')
        } else if (id === environment.KP3R_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'KP3R Bull',
            subTitle: 'Deposit KP3R-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'KP3R-ETH FLP Tokens Staked',
            image1: '/HDCOINS/KP3R.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.KP3R_ETH_FLP.replace('-FL', " FL"),
            address: environment.KP3RETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool16, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.KP3RETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool16, apiwalletservice);
    
    
          let per_hour = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---16')
        } else if (id === environment.BAND_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Band Party ',
            subTitle: 'Deposit BAND-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'BAND-ETH FLP Tokens Staked',
            image1: '/HDCOINS/BAND.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.BAND_ETH_FLP.replace('-FL', " FL"),
            address: environment.BANDETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiwalletservice.exportInstance(networkName, environment.pool17, environment.farmsABI)
          setStakeInstance(stake_instance);
          let lp_instance = await apiwalletservice.exportInstance(networkName, environment.BANDETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiwalletservice);
          await balanceOfStaked(stake_instance, userAccount, apiwalletservice);
    
          await balanceOf(lp_instance, userAccount, apiwalletservice);
          await allowance(lp_instance, userAccount, environment.pool17, apiwalletservice);
    
          let per_hour = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiwalletservice, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---17')
        }
    }
    const metaMaskConnected = async (id:any, userAccount:any) => {
        //----1
        if (id === environment.FAST_ETH_FLP) {
          console.log('-------meta ---1')
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'FAST Gang ',
            subTitle: 'Deposit FAST-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'FAST-ETH FLP Tokens Staked',
            image1: '/HDCOINS/FAST.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.FAST_ETH_FLP.replace('-FL', " FL"),
            address: environment.FASTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool1, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.FASTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool1, apiservices);
    
          let per_hour = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecFAST_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))

          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
    
          setLoading(false)
    
        } else if (id === environment.YFT_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'YFT Party ',
            subTitle: 'Deposit YFT-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'YFT-ETH FLP Tokens Staked',
            image1: '/HDCOINS/MVP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.YFT_ETH_FLP.replace('-FL', " FL"),
            address: environment.YFTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool2, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.YFTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool2, apiservices);
    
    
          let per_hour = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecYFT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---2');
        } else if (id === environment.MVP_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'MVP Champ',
            subTitle: 'Deposit MVP-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'MVP-ETH FLP Tokens Staked',
            image1: '/HDCOINS/MVP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.MVP_ETH_FLP.replace('-FL', " FL"),
            address: environment.MVPETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool3, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.MVPETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool3, apiservices);
    
    
          let per_hour = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecMVP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---3')
        } else if (id === environment.FAST_RFI_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'RFI Inter',
            subTitle: 'Deposit FAST-RFI FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'FAST-RFI FLP Tokens Staked',
            image1: '/HDCOINS/FAST.jpg',
            image2: '/HDCOINS/RFI.jpg',
            name: environment.FAST_RFI_FLP.replace('-FL', " FL"),
            address: environment.FASTRFIFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool4, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.FASTRFIFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool4, apiservices);
          let per_hour = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecFAST_RFI_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---4')
        } else if (id === environment.USDC_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Stingy Joe',
            subTitle: 'Deposit USDC-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'USDC-ETH FLP Tokens Staked',
            image1: '/HDCOINS/USDC.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.USDC_ETH_FLP.replace('-FL', " FL"),
            address: environment.USDCETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool5, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.USDCETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool5, apiservices);
    
          let per_hour = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUSDC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
    
          setLoading(false)
    
          console.log('-------metat ---5')
        } else if (id === environment.USDT_ETH_FLP) {
          console.log('---------------->>')
          // 
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Tether Mint ',
            subTitle: 'Deposit USDT-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'USDT-ETH FLP Tokens Staked',
            image1: '/HDCOINS/USDT.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.USDT_ETH_FLP.replace('-FL', " FL"),
            address: environment.USDTETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool6, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.USDTETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool6, apiservices);
    
          let per_hour = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUSDT_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---6')
        } else if (id === environment.DAI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Maker DAI ',
            subTitle: 'Deposit DAI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'DAI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/DAI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.DAI_ETH_FLP.replace('-FL', " FL"),
            address: environment.DAIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool7, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.DAIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool7, apiservices);
    
    
          let per_hour = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecDAI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---7')
        } else if (id === environment.YFI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'YFI Whale',
            subTitle: 'Deposit YFI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'YFI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/YFI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.YFI_ETH_FLP.replace('-FL', " FL"),
            address: environment.YFIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool8, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.YFIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool8, apiservices);
    
          let per_hour = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecYFI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---8')
        } else if (id === environment.WBTC_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'BTC Smart',
            subTitle: 'Deposit WBTC-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'WBTC-ETH FLP Tokens Staked',
            image1: '/HDCOINS/WBTC.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.WBTC_ETH_FLP.replace('-FL', " FL"),
            address: environment.WBTCETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool9, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.WBTCETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool9, apiservices);
    
          let per_hour = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecWBTC_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---9')
        } else if (id === environment.LINK_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Link Marin ',
            subTitle: 'Deposit LINK-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'LINK-ETH FLP Tokens Staked',
            image1: '/HDCOINS/LINK.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.LINK_ETH_FLP.replace('-FL', " FL"),
            address: environment.LINKETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool10, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.LINKETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool10, apiservices);
    
          let per_hour = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecLINK_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---10')
        } else if (id === environment.AAVE_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Aave Juicy ',
            subTitle: 'Deposit AAVE-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'AAVE-ETH FLP Tokens Staked',
            image1: '/HDCOINS/AAVE.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.AAVE_ETH_FLP.replace('-FL', " FL"),
            address: environment.AAVEETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool11, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.AAVEETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool11, apiservices);
          console.log('-------metat ---11')
          let per_hour = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecAAVE_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
        } else if (id === environment.COMP_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Compound Juicy ',
            subTitle: 'Deposit COMP-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'COMP-ETH FLP Tokens Staked',
            image1: '/HDCOINS/COMP.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.COMP_ETH_FLP.replace('-FL', " FL"),
            address: environment.COMPETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool12, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.COMPETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool12, apiservices);
    
          let per_hour = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecCOMP_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---12')
        } else if (id === environment.SNX_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Synthetic Green',
            subTitle: 'Deposit SNX-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'SNX-ETH FLP Tokens Staked',
            image1: '/HDCOINS/SNX.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.SNX_ETH_FLP.replace('-FL', " FL"),
            address: environment.SNXETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool13, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.SNXETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool13, apiservices);
    
          let per_hour = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecSNX_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---13')
        } else if (id === environment.UNI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Unicorn',
            subTitle: 'Deposit UNI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'UNI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/UNI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.UNI_ETH_FLP.replace('-FL', " FL"),
            address: environment.UNIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool14, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.UNIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool14, apiservices);
    
          let per_hour = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecUNI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---14')
        } else if (id === environment.SUSHI_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'SUSHI SUSHI',
            subTitle: 'Deposit SUSHI-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'SUSHI-ETH FLP Tokens Staked',
            image1: '/HDCOINS/SUSHI.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.SUSHI_ETH_FLP.replace('-FL', " FL"),
            address: environment.SUSHIETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool15, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.SUSHIETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool15, apiservices);
    
          let per_hour = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecSUSHI_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
          
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---15')
        } else if (id === environment.KP3R_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'KP3R Bull',
            subTitle: 'Deposit KP3R-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'KP3R-ETH FLP Tokens Staked',
            image1: '/HDCOINS/KP3R.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.KP3R_ETH_FLP.replace('-FL', " FL"),
            address: environment.KP3RETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool16, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.KP3RETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool16, apiservices);
    
    
          let per_hour = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecKP3R_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
    
          console.log('-------metat ---16')
        } else if (id === environment.BAND_ETH_FLP) {
          
          setShowObj(prevState => ({
            ...prevState, 
            title: 'Band Party ',
            subTitle: 'Deposit BAND-ETH FLP Earn FAST',
            earn: 'FAST Earned',
            deposit: 'BAND-ETH FLP Tokens Staked',
            image1: '/HDCOINS/BAND.jpg',
            image2: '/HDCOINS/ETH.jpg',
            name: environment.BAND_ETH_FLP.replace('-FL', " FL"),
            address: environment.BANDETHFLP,
            decimal: 18,
            divideValue: environment.divideValue,
          }))
    
          let stake_instance = await apiservices.exportInstance(environment.pool17, environment.farmsABI);
          setStakeInstance(stake_instance);
          let lp_instance = await apiservices.exportInstance(environment.BANDETHFLP, environment.farmsABI);
          setlpInstance(lp_instance)
    
          await earnedTokens(stake_instance, userAccount, apiservices);
          await balanceOfStaked(stake_instance, userAccount, apiservices);
    
          await balanceOf(lp_instance, userAccount, apiservices);
          await allowance(lp_instance, userAccount, environment.pool17, apiservices);

          let per_hour = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerHour) * 1000000) / 1000000
          let per_day = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerDay) * 1000000) / 1000000
          let per_week = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerWeek) * 1000000) / 1000000
          let per_year = Math.floor((environment.perSecBAND_ETH_FLP * environment.secPerYear) * 1000000) / 1000000
          setShowObj(prevState => ({
            ...prevState, 
            perHour: per_hour,
            perDay: per_day,
            perWeek: per_week,
            perYear: per_year,
          }))
    
          await totalSupply(stake_instance, userAccount, apiservices, per_hour, per_day, per_week, per_year);
          setLoading(false)
    
          console.log('-------metat ---17')
        }
    }
    // for earned 
    const earnedTokens = async (contractInstance:any, walletAddress:any, service:any) => {

        service.earnedF(contractInstance, walletAddress).then((data: any) => {
        if (data && data > 0) {
            // showObj.earned = (data / showObj.divideValue).toFixed(4);
            setShowObj(prevState => ({
              ...prevState, 
              earned: Math.floor((data / showObj.divideValue) * 1000000) / 1000000
            }))
        }
        }).catch((er:any) => {
            enqueueSnackbar('there is some issue with get earned.', { variant : "error" });
        });
    }
    // for balance GET
    const balanceOfStaked = async (contractInstance:any, walletAddress:any, service:any) => {
        service.getBalanceF(contractInstance, walletAddress).then((data: any) => {
        if (data && data > 0) {
          setShowObj(prevState => ({
            ...prevState, 
            staked: Math.floor((data / showObj.divideValue) * 1000000) / 1000000
            }))
          staked_value = data / showObj.divideValue
        }
        }).catch((er:any) => {
        // err code
        });
    }
    // for balance GET
    const balanceOf = async (contractInstance:any, walletAddress:any, service:any) => {
        service.getBalanceF(contractInstance, walletAddress).then((data: any) => {
        if (data && data > 0) {
            console.log('-------------', data)
            setShowObj(prevState => ({
              ...prevState, 
              balance: Math.floor((data / showObj.divideValue) * 1000000) / 1000000
            }))
            // showObj.balance = (data / showObj.divideValue).toFixed(4);
            console.log('---------balance----', showObj.balance)

        }
        }).catch((er:any) => {
        // err code
        });
    }
    const allowance = async (contractInstance:any, walletAddress:any, contractAddress:any, service:any) => {
        await service.allowanceF(contractInstance, walletAddress, contractAddress).then(async (data: any) => {
    
          if (data && data !== NaN && data > 0) {
            setShowObj(prevState => ({
              ...prevState, 
              approved: Math.floor((data / showObj.divideValue) * 1000000) / 1000000
            }))
    
            // showObj.approved = (data / showObj.divideValue).toFixed(4);
    
            // this.show = 'stake';
          } else {
            setShowObj(prevState => ({
              ...prevState, 
              approved: 0
            }))
          }
        }).catch((er:any) => {
          // err code
        });
    }
    const totalSupply = async (contractInstance:any, walletAddress:any, service:any, per_hour:any, per_day:any, per_week:any, per_year:any) => {
        await service.totalSupplyF(contractInstance, walletAddress).then((data: any) => {
          if (data && data > 0) {
            const total_supply = data / showObj.divideValue;
            setShowObj(prevState => ({
              ...prevState, 
              totalSupply: Math.floor((total_supply) * 1000000) / 1000000,
              networkshare: Number((staked_value / total_supply * 100).toFixed(6)),
              earnHour: Number(((staked_value / total_supply * 100) * per_hour / 100).toFixed(6)),
              earnDay: Number(((staked_value / total_supply * 100) * per_day / 100).toFixed(6)),
              earnWeek: Number(((staked_value / total_supply * 100) * per_week / 100).toFixed(6)),
              earnYear: Number(((staked_value / total_supply * 100) * per_year / 100).toFixed(6)),
            }))
          }
        }).catch((er:any) => {
          // err code
        });
    }
    // approve
    const onClickApprove= async () => {
        if (showObj.balance === 0) {
            enqueueSnackbar('You dont have enough balance.', { variant : "error" });
        } else {

            let address = userAccount;
            let instance = lpInstance;

            let service: any = '';
            if (walletId === '1') {
                service = apiservices;
            } else {
                service = apiwalletservice;
            }

            address = stakeInstance['_address'];

            let amount = new BigNumber(showObj.balance * showObj.divideValue);

            
            await service.approveF(instance, address, amount.toFixed(), userAccount, chainId).then((receipt:any) => {
                // setLoading(false)
                if (receipt) {
                    onClickRefresh();
                }
            }).catch((er:any) => {
                // setLoading(false)
                if (er && er.code) {
                } else {
                    console.log("=======check error message=======", er)
                    enqueueSnackbar(er.message, { variant : "error" });
                }
            })

        }
    }
    const setValue = (e:any) => {
      const val = e.target.value
      setStake(prevState => ({
        ...prevState, 
        // amount: (Math.floor((val) * 1000000) / 1000000) as any,
        amount: val,
        value: Math.floor((val) * 1000000) / 1000000
      }))
    }
    const checkStakeAmt = (e:any) => {
      const value = e.target.value;
        if (value) {
          if (parseFloat(value) <= showObj.approved) {
            if (parseFloat(value) < 0) {
              setStake(prevState => ({
                ...prevState, 
                amount: '',
                value: 0
              }))
              enqueueSnackbar('Amount: Must be value greater than 0.', { variant : "info" });
            } else {
              // let amt: any = Math.floor((value) * 1000000) / 1000000;
              // this.stakeForm.patchValue({ 'amount': amt });
            }
          } else {
            setStake(prevState => ({
              ...prevState, 
              amount: '',
              value: 0
            }))
            enqueueSnackbar('You do not have enough balance.', { variant : "info" });
          }
        }
    
    }
    const onClickStakeMax = () => {
      if (showObj.approved > 0) {
        setStake(prevState => ({
          ...prevState,
          amount: showObj.approved as any,
          value: showObj.approved
        }))
      }
        
    }
    const onClickStake = async () => {
      // setSubmitted1(true)
      if (stake.amount === '') {
        return;
      } else {
        let amt = Math.floor((stake.value) * 1000000) / 1000000;
        // stake.value = amt
        setStake(prevState => ({
          ...prevState,
          value: amt
        }))
  
        if (amt < 0.000001) {
          enqueueSnackbar('Can not stake less then 0.000001', { variant : "info" });
        } else {
          // setSubmitted1(false)
  
          let instance = stakeInstance;
  
          let service: any = '';
          if (walletId === '1') {
            service = apiservices;
          } else {
            service = apiwalletservice;
          }
  
          
  
          let amount = new BigNumber(stake.value * showObj.divideValue);
          console.log('--------------------', amount.toFixed())
  
          await service.stakeF(instance, amount.toFixed(), userAccount, chainId).then(async (receipt:any) => {
            // setLoading(false)
            if (receipt) {
              setStake(prevState => ({
                ...prevState, 
                amount: '',
                value: 0,
              }))
              onClickRefresh();
            }
          }).catch((er:any) => {
            // setLoading(false)
            if (er && er.code) {
              enqueueSnackbar(er.message, { variant : "error" });
              setStake(prevState => ({
                ...prevState, 
                amount: '',
                value: 0,
              }))
              // setSubmitted1(false)
            }
          });
        }
  
      }
    }
    const checkUnStakeAmt = (e:any) => {
      const value = e.target.value
      if (value) {
        if (parseFloat(value) <= showObj.staked) {
          if (parseFloat(value) < 0) {
            setUnStake(prevState => ({
              ...prevState, 
              amount: '',
              value: 0
            }))
            enqueueSnackbar('Amount: Must be value greater than 0.', { variant : "info" });
          } else {
            // let amt: any = Math.floor((e.target.value) * 1000000) / 1000000;
            // this.unStakeForm.patchValue({ 'amount': amt });
  
            // this.unStakeForm.patchValue({ 'amount': (e.target.value).toFixed() });
          }
        } else {
          setUnStake(prevState => ({
            ...prevState, 
            amount: '',
            value: 0
          }))
          enqueueSnackbar('You do not have enough balance.', { variant : "info" });
        }
      }
  
    }
  
    const onClickUnStakeMax = () => {
      if (showObj.staked > 0) {
        setUnStake(prevState => ({
          ...prevState, 
          amount: showObj.staked as any,
          value: showObj.staked,
        }))
      }
    }
  
  
    const onClickUnStack = async () => {
      // setSubmitted2(true)
      if (unstake.amount === '') {
        return;
      } else {
        if (unstake.value < 0.000001) {
          enqueueSnackbar('Can not unstake less then 0.000001.', { variant : "info" });
        } else {
          // setSubmitted2(false)
  
          let instance = stakeInstance;
  
          let service: any = '';
          if (walletId === '1') {
            service = apiservices;
          } else {
            service = apiwalletservice;
          }
  
          let amount = new BigNumber(unstake.value * showObj.divideValue);
  
          
  
          await service.withdrawF(instance, amount.toFixed(), userAccount, chainId).then(async (receipt: any) => {
            // setLoading(false)
            if (receipt) {
              setUnStake(prevState => ({
                ...prevState, 
                amount: '',
                value: 0,
              }))
              onClickRefresh();
            }
          }).catch((er:any) => {
            // setLoading(false)
            if (er && er.code) {
              enqueueSnackbar(er.message, { variant : "error" });
              setUnStake(prevState => ({
                ...prevState, 
                amount: '',
                value: 0,
              }))
              // setSubmitted2(false)
            }
          });
  
        }
  
      }
    }
  
    //-------------------------complete undtake
  
    //---------get reward ----------
  
    const getReward = async () => {
      if (showObj.earned && showObj.earned > 0) {
        if (userAccount) {
          let instance = stakeInstance;
  
          let service: any = '';
          if (walletId === '1') {
            service = apiservices;
          } else {
            service = apiwalletservice;
          }
  
          // if (this.id === '5' || this.id === '6' ) {
          service.lastTimeRewardedF(instance, userAccount, chainId).then(async (res:any) => {
            if (res) {
              res = parseInt(res);
              let currentTime: any = new Date().getTime() / 1000;
              if (parseInt(currentTime) > (res + environment.rewardInterval)) {
                await getRewardInside(service, instance, userAccount, chainId);
  
              } else {
  
                let diff = res - parseInt(currentTime);
                let dif1: any = diff + environment.rewardInterval;
                let a = ConvertSectoDay(dif1);
                enqueueSnackbar('You can claim reward after ' + a, { variant : "info" });
              }
  
            }
          })
          // } else {
          //   await this.getRewardInside(service, instance, userAccount, chainId);
          // }
  
  
        }
      } else {
        enqueueSnackbar('You dont have reward.', { variant : "info" });
      }
    }
  
    const getRewardInside = async (service:any, instance:any, userAccount:any, chainId:any) => {
      
      service.getRewardF(instance, userAccount, chainId).then((receipt:any) => {
        // setLoading(false)
        if (receipt) {
          onClickRefresh();
        }
      }).catch((er:any) => {
        // setLoading(false)
        if (er) {
          enqueueSnackbar(er.message, { variant : "error" });
        }
      })
    }
  
  
    const ConvertSectoDay = (n:any) => {
      let day: any = n / (24 * 3600);
  
      n = n % (24 * 3600);
      let hour: any = n / 3600;
  
      n %= 3600;
      let minutes: any = n / 60;
  
      n %= 60;
      let seconds: any = n;
  
      let a = parseInt(day) + ' ' + 'days ' + parseInt(hour) + ' hours ' + parseInt(minutes) + ' minutes ';
      return a;
    }
  
    const onClickExit = () => {
      let instance = stakeInstance;
  
      let service;
      if (walletId === '1') {
        service = apiservices;
      } else {
        service = apiwalletservice;
      }
      
      service.getRewardF(instance, userAccount, chainId).then((receipt:any) => {
        // setLoading(false)
        if (receipt) {
          onClickRefresh();
        }
      }).catch((er:any) => {
        // setLoading(false)
        if (er) {
          enqueueSnackbar(er.message, { variant : "error" });
        }
      })
    }
    const onClickRefresh = () => {
        window.location.reload();
    }
    const gotoPage = (page:any) => {
      History.push(`/${page}`);
    };
    return (
        <>
            <Spinner isLoading={isLoading} />
            <Box className={classes.bgImage} style={{
                backgroundImage: `url('/bg_farmdetail.png')`,
            }} />
            <Box className={classes.mainContainer} >
                <Box style={{display: "flex", alignItems: "center"}}>
                  <Button onClick={() => gotoPage('farms')} style={{color: "#FCFCFC"}}>Farms</Button><Typography style={{color: "#FCFCFC"}}>/ <Typography style={{paddingLeft: 12}} component="span">{showObj.title}</Typography></Typography>
                </Box>
                <Typography style={{ fontSize: 48, fontWeight: 500, textAlign: 'center', color: "#FCFCFC", paddingBottom: 43, paddingTop: 30 }}>{showObj.title ? showObj.title : '-'}</Typography>
                <Box className={classes.panelWrapper}>
                    <Box className={classes.infoPanel}>
                        <Typography className={classes.infoTitle}>Your Earnings</Typography>
                        <Box style={{ display: "flex", alignItems: 'center', paddingBottom: 30}}>
                          <Typography style={{ fontSize: 14, fontWeight: 500 }}>FAST Token: {showObj.earned ? showObj.earned : 0}</Typography>
                          <Button disabled={showObj.earned === 0 ? true : false} onClick={() => getReward()} variant="outlined" className={
                            clsx({
                              [classes.deactivedHarvest]: showObj.earned === 0,
                              [classes.activedHarvest]: showObj.earned !== 0
                            })
                          }>HARVEST</Button>
                        </Box>
                        <Typography className={classes.infoTitle}>Network Share</Typography>
                        <Typography style={{ fontSize: 24, fontWeight: 500, paddingBottom: 16 }}>{showObj.networkshare ? showObj.networkshare : '0.000000'}%</Typography>
                        <Divider />
                        <Typography className={classes.infoTitle} style={{paddingTop: 16}}>Total Stake</Typography>
                        <Typography style={{ fontSize: 24, fontWeight: 500, paddingBottom: 16 }}>{showObj.totalSupply ? showObj.totalSupply : 0}</Typography>
                        <Typography className={classes.infoTitle}>Your Amount Staked</Typography>
                        <Typography style={{ fontSize: 24, fontWeight: 500, paddingBottom: 16 }}>{showObj.staked ? showObj.staked : 0}</Typography>
                        {(showObj.staked !== 0 || showObj.earned !== 0) && <Button onClick={() => onClickExit()} style={{fontSize: 16, fontWeight: 500, color: "#9DD1B2", border: "1px solid #9DD1B2", padding: "8px 20px", borderRadius: 8}}>EXIT THIS FARM</Button>}
                    </Box>
                    <Box className={classes.farmPanel}>
                        <Typography className={classes.infoTitle}>The Pair</Typography>
                        <Box style={{ display: "flex" }}>
                            <img alt="" src={showObj.image1 ? showObj.image1 : ''} width="48px" height="48px" style={{ borderRadius: "50px", border: "1px solid #d4d4d4" }} />
                            <img alt="" src={showObj.image2 ? showObj.image2 : ''} width="48px" height="48px" style={{ marginLeft: "-8px", borderRadius: "50px", border: "1px solid #d4d4d4" }} />
                            <Typography style={{ fontSize: 34, fontWeight: 300, paddingLeft: 16 }}>{showObj.deposit.split('FLP')[0]}</Typography>
                        </Box>
                        {showObj.approved === 0 && <Button onClick={() => onClickApprove()} disabled = {showObj.balance === 0 ? true : false} className={
                          clsx({
                            [classes.deactivedApprove]: showObj.balance === 0,
                            [classes.activedApprove]: showObj.balance !== 0
                          })}>APPROVE</Button>}
                        <Box style={{display: "flex", justifyContent: "space-between"}}>
                          {showObj.approved !== 0 && <Button onClick={openStakeModal} disabled = {showObj.approved === 0 ? true : false} className={
                            clsx({
                              [classes.disabledButton]: showObj.approved === 0,
                              [classes.enabledButton]: showObj.approved !== 0
                            })}>Stake</Button>}

                          {showObj.staked !== 0 && <Button onClick={openUnStakeModal} disabled = {showObj.staked === 0 ? true : false} className={
                            clsx({
                              [classes.disabledButton]: showObj.staked === 0,
                              [classes.enabledButton]: showObj.staked !== 0
                            })}>UnStake</Button>}
                        </Box>
                        <Typography className={classes.infoTitle}>Your {showObj.name ? showObj.name :'-'} Balance</Typography>
                        <Typography style={{ fontSize: 24, fontWeight: 500, paddingBottom: 41 }}>{showObj.balance ? showObj.balance : '0'}</Typography>
                        <Typography className={classes.infoTitle}>Reward Distribution Rate / Your Earnings</Typography>
                        <Box style={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography className={classes.farmTitle}>Per Hour</Typography>
                                <Typography className={classes.farmTitle}>Per Day</Typography>
                                <Typography className={classes.farmTitle}>Per Week</Typography>
                                <Typography className={classes.farmTitle}>Per Year</Typography>
                            </Box>
                            <Box>
                                <Typography className={classes.farmValue}>{showObj.perHour ? showObj.perHour : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.perDay ? showObj.perDay : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.perWeek ? showObj.perWeek : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.perYear ? showObj.perYear : 0}</Typography>
                            </Box>
                            <Box>
                                <Typography className={classes.farmValue}>{showObj.earnHour ? showObj.earnHour : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.earnDay ? showObj.earnDay : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.earnWeek ? showObj.earnWeek : 0}</Typography>
                                <Typography className={classes.farmValue}>{showObj.earnYear ? showObj.earnYear : 0}</Typography>
                            </Box>
                        </Box>
                        <Button
                            onClick={() => window.open("https://etherscan.io/address/"+showObj.address)}
                            style={{ background: "transparent", color: "#2BA55D", fontSize: "16px", marginTop: 56 }}
                            startIcon={<OpenInNewIcon />}
                        >
                            View on Etherscan
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Dialog open={openStake} aria-labelledby="simple-dialog-title" onClose={handleClose1} classes={{ paper: classes.modalWrapper }}>
                <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
                    <IconButton onClick={handleClose1} aria-label="close" >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box className={classes.modalContainer}>
                    <Typography style={{ fontSize: 34, fontWeight: 300 }}>{showObj.title ? showObj.title : '-'}</Typography>
                    <Typography style={{ fontSize: 16, fontFamily: "Raleway", padding: "10px 0px" }}>Stake {showObj.name ? showObj.name :'-' } Tokens</Typography>

                    <Box className={classes.inputPanel}>
                      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box>
                          <TextField 
                            className={classes.input} 
                            variant="outlined" 
                            onKeyUp={(event: any) => { 
                              checkStakeAmt(event)
                            }}
                            onChange={(event: any) => {
                              setValue(event)
                            }}
                            value={stake.amount}
                            placeholder="0"
                            // helperText={submitted1 && "Incorrect value."}
                          />
                        </Box>
                        <Box>
                          <Button onClick={() => onClickStakeMax()} style={{ fontSize: 16, fontWeight: 500, color: "#2BA55D", background: "transparent" }}>MAX</Button>
                        </Box>
                      </Box>
                      <Typography style={{ fontSize: 12, fontFamily: "Raleway", padding: "10px 16px", textAlign: "right"}}>{showObj.approved ? showObj.approved : 0} {showObj.name ? showObj.name :'-' } Available</Typography>
                    </Box>
                    <Button onClick={() => onClickStake()} style={{ color: "white", fontSize: 16, backgroundColor: "#2BA55D", width: "100%", height: 79, marginTop: 16, marginBottom: 20, borderRadius: 8 }}>CONFIRM</Button>
                </Box>
            </Dialog>
            <Dialog open={openUnstake} aria-labelledby="simple-dialog-title" onClose={handleClose2} classes={{ paper: classes.modalWrapper }}>
                <Box style={{ paddingRight: "20px", paddingTop: "10px", textAlign: "right" }}>
                    <IconButton onClick={handleClose2} aria-label="close" >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box className={classes.modalContainer}>
                    <Typography style={{ fontSize: 34, fontWeight: 300 }}>{showObj.title ? showObj.title : '-'}</Typography>
                    <Typography style={{ fontSize: 16, fontFamily: "Raleway", padding: "10px 0px" }}>Unstake {showObj.name ? showObj.name :'-' } Tokens</Typography>

                    <Box className={classes.inputPanel}>
                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Box>
                              <TextField 
                                disabled={showObj.staked === 0 ? true : false} 
                                className={classes.input} 
                                variant="outlined"
                                onKeyUp={(event: any) => { 
                                  checkUnStakeAmt(event)
                                }}
                                onChange={(event: any) => { 
                                  setValue(event)
                                }}
                                value={unstake.amount}
                                placeholder="0"
                                // helperText={submitted2 && "Incorrect value."} 
                              />
                            </Box>
                            <Box>
                              <Button onClick={() => onClickUnStakeMax()} style={{ fontSize: 16, fontWeight: 500, color: "#2BA55D", background: "transparent" }}>MAX</Button>
                            </Box>
                        </Box>
                        <Typography style={{ fontSize: 12, fontFamily: "Raleway", padding: "10px 0px" }}>{showObj.staked ? showObj.staked :0} {showObj.name ? showObj.name :'-' } Staked</Typography>
                    </Box>
                    <Button onClick={() => onClickUnStack()} disabled={showObj.staked === 0 ? true : false} style={{ color: "white", fontSize: 16, backgroundColor: "#2BA55D", width: "100%", height: 79, marginTop: 16, marginBottom: 20, borderRadius: 8 }}>CONFIRM</Button>
                </Box>
            </Dialog>
        </>
    )
}

export default Farm_detail
