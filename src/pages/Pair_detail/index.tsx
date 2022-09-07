import React, {useEffect, useState, useMemo} from 'react';
import Grid from "@material-ui/core/Grid";
import Swap from "../Swap";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import DetailChart from "../../components/DetailChart";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useStyles from "../../assets/styles";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useParams } from "react-router-dom";
import {useSwapActionHandlers} from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'
import axios from 'axios';
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Pair } from '@uniswap/sdk/dist'

const Pair_detail = () => {
    const classes = useStyles.grid();
    const pairdetailClasses = useStyles.pairdetail();
    const liquidity0 = JSON.parse(sessionStorage.getItem("liquidity0") as any);
    const liquidity1 = JSON.parse(sessionStorage.getItem("liquidity1") as any);
    const pairData = JSON.parse(sessionStorage.getItem("selectedPairInfo") as any);
    const [addr1, setAddr1] = useState({
        value: '',
        copied: false
    })
    const [pooledtoken0, setPooledToken0] = useState('')
    const [pooledtoken1, setPooledToken1] = useState('')
    const { onCurrencySelection } = useSwapActionHandlers()
    const [currentTokenInfo0_A, setCurrentTokenInfo0_A] = useState<any>({});  //get data from contract address
    const [currentTokenInfo1_A, setCurrentTokenInfo1_A] = useState<any>({});  //get data from contract address
    const [currentTokenInfo0_C, setCurrentTokenInfo0_C] = useState<any>({});  //get data from coin id
    const [currentTokenInfo1_C, setCurrentTokenInfo1_C] = useState<any>({});  //get data from coin id
    const History = useHistory();
    const {pairAddress}:any = useParams();
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )
    const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))
    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
    useEffect(() => {
          allV2PairsWithLiquidity.forEach(async pair => {
            if(pair.liquidityToken.address === pairAddress){
                onCurrencySelection(Field.INPUT, pair.token0)
                onCurrencySelection(Field.OUTPUT, pair.token1)
                setPooledToken0(pair.reserve0.toSignificant(6))
                setPooledToken1(pair.reserve1.toSignificant(6))
            }
          })
        
      }, [])
    useEffect(() => {
        if(pairData.tokenAmounts[0].currency.address && pairData.tokenAmounts[0].currency.symbol !== 'WETH'){
            try {
                axios
                .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pairData.tokenAmounts[0].currency.address}`)
                .then(response => {
                    if (response.data.market_data?.current_price.usd) {
                        setCurrentTokenInfo0_A(response.data);
                    }
                    
                })
            } catch (e) {
                console.log(`Axios request failed: ${e}`)
            }
        }else if(pairData.tokenAmounts[0].currency.symbol === 'WETH'){
            try {
                axios
                .get(`https://api.coingecko.com/api/v3/coins/ethereum`)
                .then(response => {
                    if (response.data.market_data?.current_price.usd) {
                        setCurrentTokenInfo0_C(response.data);
                    }
                    
                })
            } catch (e) {
                console.log(`Axios request failed: ${e}`)
            }
        }
        if(pairData.tokenAmounts[1].currency.address && pairData.tokenAmounts[1].currency.symbol !== 'WETH'){
            try {
                axios
                .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pairData.tokenAmounts[1].currency.address}`)
                .then(response => {
                    if (response.data.market_data?.current_price.usd) {
                        setCurrentTokenInfo1_A(response.data);
                    }
                    
                })
            } catch (e) {
                console.log(`Axios request failed: ${e}`)
            }
        }
        else if(pairData.tokenAmounts[1].currency.symbol === 'WETH'){
            try {
                axios
                .get(`https://api.coingecko.com/api/v3/coins/ethereum`)
                .then(response => {
                    if (response.data.market_data?.current_price.usd) {
                        setCurrentTokenInfo1_C(response.data);
                    }
                    
                })
            } catch (e) {
                console.log(`Axios request failed: ${e}`)
            }
        }
    }, [])
    const gotoPage = (page: any) => {
        History.push(`/${page}`);
    };
    return (
        <>
            <Box className={pairdetailClasses.mainContainer}>
                <Container>
                    <Box style={{ display: "flex", alignItems: "center"}}>
                        <Button onClick={() => gotoPage('pairs')}>Pairs</Button>
                        <IconButton>
                            <ArrowRightAltIcon />
                        </IconButton>
                        <Typography style={{paddingLeft: 16}}>{pairData.tokenAmounts[0].currency.symbol} - {pairData.tokenAmounts[1].currency.symbol}</Typography>
                    </Box>
                    <Box style={{ display: "flex", alignItems: "center", padding: "16px 0px" }}>
                        <img alt="token0" src={pairData.tokenAmounts[0].currency.symbol === 'WETH' ? currentTokenInfo0_C.image?.small : currentTokenInfo0_A.image?.small} style={{width:40, height:40, border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                        <img alt="token1" src={pairData.tokenAmounts[1].currency.symbol === 'WETH' ? currentTokenInfo1_C.image?.small : currentTokenInfo1_A.image?.small} style={{width:40, height:40, marginLeft: "-10px", border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                        <Typography variant="h4">{pairData.tokenAmounts[0].currency.symbol} - {pairData.tokenAmounts[1].currency.symbol}</Typography>
                    </Box>
                    <Box className={pairdetailClasses.infoWrapper}>
                        <Button variant="outlined" style={{marginRight: 16, border: "1px solid #6BC08E"}}>
                            <img alt="token0" src={pairData.tokenAmounts[0].currency.symbol === 'WETH' ? currentTokenInfo0_C.image?.small : currentTokenInfo0_A.image?.small} style={{width:16, height:16, border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                            <Typography style={{ padding: "0px 8px"}}>1 {pairData.tokenAmounts[0].currency.symbol} = {(Number(currentTokenInfo0_A?.market_data?.current_price?.usd ? currentTokenInfo0_A.market_data?.current_price.usd : currentTokenInfo0_C.market_data?.current_price.usd) / Number(currentTokenInfo1_A.market_data?.current_price?.usd ? currentTokenInfo1_A.market_data?.current_price.usd : currentTokenInfo1_C.market_data?.current_price.usd)).toFixed(6)} {pairData.tokenAmounts[1].currency.symbol} ( US$ {currentTokenInfo0_A.market_data?.current_price?.usd ? currentTokenInfo0_A.market_data?.current_price.usd : currentTokenInfo0_C.market_data?.current_price.usd}) </Typography>
                        </Button>
                        <Button variant="outlined" style={{marginRight: 16, border: "1px solid #6BC08E"}} className={pairdetailClasses.token1Value}>
                            <img alt="token1" src={pairData.tokenAmounts[1].currency.symbol === 'WETH' ? currentTokenInfo1_C.image?.small : currentTokenInfo1_A.image?.small} style={{width:16, height:16, border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                            <Typography style={{ padding: "0px 8px"}}>1 {pairData.tokenAmounts[1].currency.symbol} = {(Number(currentTokenInfo1_A?.market_data?.current_price?.usd ? currentTokenInfo1_A.market_data?.current_price.usd : currentTokenInfo1_C.market_data?.current_price.usd) / Number(currentTokenInfo0_A.market_data?.current_price?.usd ? currentTokenInfo0_A.market_data?.current_price.usd : currentTokenInfo0_C.market_data?.current_price.usd)).toFixed(6)} {pairData.tokenAmounts[0].currency.symbol} ( US$ {currentTokenInfo1_A.market_data?.current_price?.usd ? currentTokenInfo1_A.market_data?.current_price.usd : currentTokenInfo1_C.market_data?.current_price.usd})</Typography>
                        </Button>
                    </Box>
                    <Grid container spacing={2} className={classes.gridWrapper} style={{paddingLeft: 8, paddingRight: 8}}>
                        <Box className={classes.boxWrapper} style={{ display: "flex", flexDirection: "column", width: "calc(100% - 423px - 16px", marginRight: "16px" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Total Liquidity</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}>$ {pairData.tokenAmounts[0].currency.symbol !== "WETH" ? Number(liquidity0).toLocaleString() : Number(liquidity1).toLocaleString()}</Typography>
                                                {/* <Typography style={{fontSize: 14, color: '#6BC08E'}}>+0.00%</Typography> */}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Volume (24H)</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}>$ {currentTokenInfo0_A.market_data?.total_volume.usd ? currentTokenInfo0_A.market_data?.total_volume.usd.toLocaleString() : currentTokenInfo1_A.market_data?.total_volume.usd.toLocaleString()}</Typography>
                                                {/* <Typography style={{fontSize: 14, color: '#6BC08E'}}>+0.00%</Typography> */}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Fees (24H)</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}></Typography>
                                                {/* <Typography style={{fontSize: 14, color: '#6BC08E'}}>+0.00%</Typography> */}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>   
                            <Grid container spacing={2} style={{ flexGrow: 1, paddingTop: 16}}>
                                <Grid item xs={12}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Pooled Tokens</Typography>
                                            <Box className={pairdetailClasses.pooledPanel}>
                                                <Box style={{display: "flex", alignItems: "center" }}>
                                                    <img alt="token0" src={pairData.tokenAmounts[0].currency.symbol === 'WETH' ? currentTokenInfo0_C.image?.small : currentTokenInfo0_A.image?.small} style={{width:24, height:24, border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                                                    <Typography className={pairdetailClasses.pooledTitle} style={{paddingLeft: 8}}>{Number(pooledtoken0).toLocaleString()} {pairData.tokenAmounts[0].currency.symbol}</Typography>
                                                </Box>
                                                <Box style={{display: "flex", alignItems: "center" }}>
                                                    <img alt="token0" src={pairData.tokenAmounts[1].currency.symbol === 'WETH' ? currentTokenInfo1_C.image?.small : currentTokenInfo1_A.image?.small} style={{width:24, height:24, border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                                                    <Typography className={pairdetailClasses.pooledTitle} style={{paddingLeft: 8}}>{Number(pooledtoken1).toLocaleString()} {pairData.tokenAmounts[1].currency.symbol}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{ flexGrow: 1, paddingTop: 16 }}>
                                <Grid item xs={12}>
                                <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", height: '100%', borderRadius: 8, position: "relative", overflow: "visible", zIndex: 1201}}>
                                        <DetailChart chartOption={'pair_detail'} chartData={pairData.tokenAmounts[1].currency.address ? pairData.tokenAmounts[1].currency.address : pairData.tokenAmounts[0].currency.address} />
                                        {/* <Stockchart /> */}
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box className={classes.swapContainer}>
                            <Swap />
                        </Box>
                    </Grid>
                </Container>
            </Box>
            <Box className={classes.container}>
                <Container>
                    <Box>
                    {isMobile ? 
                        <Box style={{marginBottom: "64px", marginTop: "64px"}}>
                            <Grid container spacing={2} style={{padding: "10px 16px"}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.tableTitle}>Pair Name</Typography>
                                    <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0, paddingLeft: 0}}>
                                        {pairData?.tokenAmounts[0].currency.symbol} - {pairData?.tokenAmounts[1].currency.symbol}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{padding: "10px 16px"}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.tableTitle}>Pair Address</Typography>
                                    <CopyToClipboard text={pairAddress}
                                        onCopy={() => setAddr1(prevState => ({...prevState, copied: true}))}>
                                        <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0, paddingLeft: 0}} endIcon={<FileCopyOutlinedIcon />}>
                                            {pairAddress.substring(0,8)+"..."+pairAddress.substring((pairAddress.length-6), pairAddress.length)}
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{padding: "10px 16px"}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.tableTitle}>{pairData.tokenAmounts[0].currency.symbol} Address</Typography>
                                    <CopyToClipboard text={pairData.tokenAmounts[0].currency.address}>
                                        <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0, paddingLeft: 0}} endIcon={<FileCopyOutlinedIcon />}>
                                            {pairData.tokenAmounts[0].currency.address.substring(0,8)+"..."+pairData.tokenAmounts[0].currency.address.substring((pairData.tokenAmounts[0].currency.address.length-6), pairData.tokenAmounts[0].currency.address.length)}
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{padding: "10px 16px"}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.tableTitle}>{pairData.tokenAmounts[1].currency.symbol} Address</Typography>
                                    <CopyToClipboard text={pairData.tokenAmounts[1].currency.address}>
                                        <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0, paddingLeft: 0}} endIcon={<FileCopyOutlinedIcon />}>
                                            {pairData.tokenAmounts[1].currency.address.substring(0,8)+"..."+pairData.tokenAmounts[1].currency.address.substring((pairData.tokenAmounts[1].currency.address.length-6), pairData.tokenAmounts[1].currency.address.length)}
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                            <Box style={{display: "flex", justifyContent: "center", paddingBottom: "24px", paddingTop: "16px"}}>
                                <Button
                                    onClick={() => window.open("https://etherscan.io/address/"+pairAddress)}
                                    style={{ background :"#EBF8F0", color: "#2BA55D", fontSize: "16px"}}
                                    startIcon={<OpenInNewIcon />}
                                >
                                    View on Etherscan
                                </Button>
                            </Box>
                        </Box> :
                        <TableContainer component={Paper} style={{ marginTop:  16 ,borderRadius: '16px', boxShadow: "none" }}>
                        <Typography style={{fontSize: 24, fontWeight: "bold", paddingTop: "24px", paddingBottom: "24px", paddingLeft: 16}}>Pair Information</Typography>
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "15%", border: "none"}}>
                                    <Typography className={classes.tableTitle}>Pair Name</Typography>
                                </TableCell>
                                <TableCell style={{ width: "15%", border: "none"}}>
                                    <Typography className={classes.tableTitle}>Pair Address</Typography>
                                </TableCell>
                                <TableCell  style={{ width: "15%", border: "none"}}>
                                    <Typography className={classes.tableTitle}>{pairData.tokenAmounts[0].currency.symbol}  Address</Typography>
                                </TableCell>
                                <TableCell  style={{ width: "15%", border: "none"}}>
                                    <Typography className={classes.tableTitle}>{pairData.tokenAmounts[1].currency.symbol}  Address</Typography>
                                </TableCell>
                                <TableCell  style={{ width: "40%", border: "none"}}>
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ fontSize: 20, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                    {pairData?.tokenAmounts[0].currency.symbol} - {pairData?.tokenAmounts[1].currency.symbol}
                                    </TableCell>
                                    <TableCell style={{ border: "none", paddingTop: 0}}>
                                        <CopyToClipboard text={pairAddress}
                                            onCopy={() => setAddr1(prevState => ({...prevState, copied: true}))}>
                                            <Button style={{ fontSize: 20, fontWeight: "bold"}} endIcon={<FileCopyOutlinedIcon />}>
                                                {pairAddress.substring(0,8)+"..."+pairAddress.substring((pairAddress.length-6), pairAddress.length)}
                                            </Button>
                                        </CopyToClipboard>
                                    </TableCell>
                                    <TableCell style={{ border: "none", paddingTop: 0}}>
                                        <CopyToClipboard text={pairData.tokenAmounts[0].currency.address}>
                                            <Button style={{ fontSize: 20, fontWeight: "bold"}} endIcon={<FileCopyOutlinedIcon />}>
                                                {pairData.tokenAmounts[0].currency.address.substring(0,8)+"..."+pairData.tokenAmounts[0].currency.address.substring((pairData.tokenAmounts[0].currency.address.length-6), pairData.tokenAmounts[0].currency.address.length)}
                                            </Button>
                                        </CopyToClipboard>
                                    </TableCell>
                                    <TableCell style={{ border: "none", paddingTop: 0}}>
                                        <CopyToClipboard text={pairData.tokenAmounts[1].currency.address}>
                                            <Button style={{ fontSize: 20, fontWeight: "bold"}} endIcon={<FileCopyOutlinedIcon />}>
                                                {pairData.tokenAmounts[1].currency.address.substring(0,8)+"..."+pairData.tokenAmounts[1].currency.address.substring((pairData.tokenAmounts[1].currency.address.length-6), pairData.tokenAmounts[1].currency.address.length)}
                                            </Button>
                                        </CopyToClipboard>
                                    </TableCell>
                                    <TableCell style={{ border: "none", paddingTop: 0}} align="right">
                                        <Button
                                            onClick={() => window.open("https://etherscan.io/address/"+pairAddress)}
                                            style={{ background :"#EBF8F0", color: "#2BA55D", fontSize: "16px"}}
                                            startIcon={<OpenInNewIcon />}
                                        >
                                            View on Etherscan
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </TableContainer>}
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default Pair_detail;