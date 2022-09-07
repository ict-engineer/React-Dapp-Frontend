import React, { useMemo, useState, useEffect } from 'react'
import useStyles from '../../assets/styles'
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
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePairs } from 'data/Reserves'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ExternalLink } from 'theme'
import axios from 'axios'
import { useHistory } from 'react-router';
import { Pair } from '@uniswap/sdk/dist'
import { Link } from 'react-router-dom'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useParams } from "react-router-dom";
import {useSwapActionHandlers} from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { BigNumber } from '@ethersproject/bignumber'

const Token_detail = () => {
    const classes = useStyles.grid();
    const tokendetailClasses = useStyles.tokendetail();
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )
    const [tokenInfo, setTokenInfo] = useState<any>([])
    const { onCurrencySelection } = useSwapActionHandlers()
    const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    const isMobile = useMediaQuery('(max-width: 1024px)');
    // USD Price
    const [tokenPrices, setTokenPrices] = useState<{ [key: string]: string }>({})

    const History = useHistory();
    const {tokenAddress}:any = useParams();
    const [page, setPage] = useState(1);  
    const changePage = (e:any, value:any) => {
        setPage(value);
    }
    const gotoPage = (page: any) => {
        History.push(`/${page}`);
      };
    useEffect(() => {
        const getTokenPrices = async () => {
          allV2PairsWithLiquidity.forEach(async pair => {
            if (pair.token0.address) {
              if(pair.token0.address === tokenAddress && pair.token0.address !== '0xC888A0Ab4831A29e6cA432BaBf52E353D23Db3c2')  {
                onCurrencySelection(Field.INPUT, pair.token0)
              }else if(pair.token1.address === tokenAddress && pair.token1.address !== '0xC888A0Ab4831A29e6cA432BaBf52E353D23Db3c2') {
                onCurrencySelection(Field.INPUT, pair.token1)
              }
              try {
                axios
                  .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token0.address}`)
                  .then(response => {
                    if (pair.token0.address && response.data.market_data?.current_price.usd) {
                      setTokenPrices(prevState => ({
                        ...prevState,
                        [pair.token0.address]: BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)).toString()
                      }))
                    }
                  })
              } catch (e) {
                console.log(`Axios request failed: ${e}`)
              }
            }
          })
        }
        getTokenPrices()
      }, [])
    useEffect(() => {
        if (tokenAddress) {
            try {
              axios
                .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`)
                .then(response => {
                  if (tokenAddress && response.data.market_data?.current_price.usd) {
                    setTokenInfo(response.data)
                  }
                })
            } catch (e) {
              console.log(`Axios request failed: ${e}`)
            }
          }
    }, [])
    return (
        <>
            <Box className={tokendetailClasses.mainContainer}>
                <Container>
                    <Box style={{ display: "flex", alignItems: "center"}}>
                        <Button onClick={() => gotoPage('tokens')}>Token</Button>
                        <IconButton>
                            <ArrowRightAltIcon />
                        </IconButton>
                        <Typography style={{paddingLeft: 16}}>{tokenInfo.symbol?.toString().toUpperCase()}</Typography>
                        <Typography style={{fontFamily: "Raleway", color: "#6BC08E", paddingLeft: "8px"}}>( {tokenAddress.substring(0,8)+"..."+tokenAddress.substring((tokenAddress.length-6), tokenAddress.length)} )</Typography>
                    </Box>
                    <Box style={{ display: "flex", alignItems: "baseline", padding: "16px 0px" }} className={classes.infoWrapper}>
                        <Box>
                            <img src={tokenInfo?.image?.small} alt="tokenicon" style={{ width: 40, height: 40, margin: "8px 8px", marginLeft: "0px", marginBottom: "0px", border: "1px solid #d4d4d4", borderRadius: "50%"}} />
                            <Typography variant="h4">{tokenInfo.name} ({tokenInfo.symbol?.toString().toUpperCase()})</Typography>
                        </Box>
                        <Box>
                            <Typography  style={{fontSize: 24, fontWeight: 500, paddingLeft: 16}}>$ {tokenInfo.market_data?.current_price.usd.toLocaleString()}</Typography>
                            <Typography style={{fontSize: 14, fontWeight: 500, paddingLeft: 16, color: "#6BC08E"}}>{tokenInfo.market_data?.price_change_percentage_24h.toFixed(2)}%</Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2} className={ classes.gridWrapper }>
                        <Box className={ classes.boxWrapper } style={{ display: "flex", flexDirection: "column", width: "calc(100% - 423px - 16px)", marginRight: "16px", paddingLeft: "8px", paddingRight: "8px"}}>
                            <Grid container spacing={2}>
                                <Grid item xs ={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Total Liquidity</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}>$ {tokenInfo.market_data?.market_cap.usd.toLocaleString()}</Typography>
                                                <Typography style={{fontSize: 14, color: '#6BC08E'}}>{tokenInfo.market_data?.market_cap_change_percentage_24h.toFixed(2)}%</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs ={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Volume (24H)</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}>$ {tokenInfo.market_data?.total_volume.usd.toLocaleString()}</Typography>
                                                <Typography style={{fontSize: 14, color: '#6BC08E'}}>{tokenInfo.market_data?.price_change_percentage_24h.toFixed(2)}%</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs ={12} sm={4}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", borderRadius: 8}}>
                                        <CardContent>
                                            <Typography style={{fontSize: 14, color: '#9DD1B2'}}>Transactions</Typography>
                                            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Typography style={{fontSize: 20}}>{Math.round(tokenInfo.market_data?.total_volume.usd/tokenInfo.market_data?.current_price.usd).toLocaleString()}</Typography>
                                                {/* <Typography style={{fontSize: 14, color: '#6BC08E'}}>+0.00%</Typography> */}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>   
                            <Grid container spacing={2} style={{ flexGrow: 1, paddingTop: 16 }}>
                                <Grid item xs={12}>
                                    <Card style={{ boxShadow: "0px 0px 6px 0px rgba(0,0,0,.1)", height: '100%', borderRadius: 8, position: "relative", overflow: "visible", zIndex: 1201}}>
                                        <DetailChart chartOption={'token_detail'} chartData={tokenAddress} />

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
                    <Box style={{marginTop: "50px"}}>
                    <TableContainer component={Paper} style={{ borderRadius: '16px', boxShadow: "none", padding: 16}}>
                        {!isMobile && <Typography style={{fontSize: 24, fontWeight: "bold", paddingTop: "24px", paddingLeft: "24px"}}>Top Pairs</Typography>}
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>
                                <Typography className={classes.tableTitle}>Name</Typography>
                                </TableCell>
                                <TableCell align="right">
                                <Typography className={classes.tableTitle}>Pool Address</Typography>
                                </TableCell>
                                <TableCell align="right">
                                <Typography className={classes.tableTitle}>Liquidity</Typography>
                                </TableCell>
                                <TableCell align="right">
                                <Typography className={classes.tableTitle}>Action</Typography>
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {allV2PairsWithLiquidity.map((pair, idx) => {
                                if(idx >= (page - 1) * 5 && idx < page * 5){
                                    return(
                                        <TableRow key={pair.liquidityToken.address}>
                                            <TableCell>
                                                <div style={{ display: 'flex'}}>
                                                    <DoubleCurrencyLogo
                                                    currency0={unwrappedToken(pair.token0)}
                                                    currency1={unwrappedToken(pair.token1)}
                                                    margin={true}
                                                    size={30}
                                                    />
                                                    {unwrappedToken(pair.token0).symbol} / {unwrappedToken(pair.token1).symbol}
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                <ExternalLink href={`https://etherscan.io/address/${pair.liquidityToken.address}`}>
                                                {pair.liquidityToken.address.substring(0,6)+"..."+pair.liquidityToken.address.substring((pair.liquidityToken.address.length-4), pair.liquidityToken.address.length)}
                                                </ExternalLink>
                                            </TableCell>
                                            <TableCell align="right">
                                                US${' '}
                                                {tokenPrices[pair.token0.address]
                                                ? pair.reserve0
                                                    .multiply(tokenPrices[pair.token0.address])
                                                    .divide('5000000000')
                                                    .toSignificant(6)
                                                : '...'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <ButtonPrimary
                                                as={Link}
                                                to={`/add/${currencyId(unwrappedToken(pair.token0))}/${currencyId(unwrappedToken(pair.token1))}`}
                                                width="25%" 
                                                >
                                                + ADD MORE
                                                </ButtonPrimary>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } else {
                                    return;
                                }
                            })}
                            </TableBody>
                        </Table>
                        {/* <Button onClick={() => gotoPage('Pairs')} color="primary" style={{marginLeft: "45%", marginTop: "30px", marginBottom: "30px"}}><Typography style={{fontSize: "16px", fontWeight: 500}}>SEE ALL PAIRS</Typography></Button> */}
                        <Box style={{ justifyContent: "center", alignItems: "center", padding: "16px 0px", display: "flex"}}>
                            <Pagination 
                                page={page}
                                count={Math.round(allV2PairsWithLiquidity.length / 5)}
                                showFirstButton 
                                showLastButton 
                                onChange={changePage}
                                className={tokendetailClasses.pagination}
                                variant="outlined"
                                color="primary"
                                size={isMobile ? "small" : "large"}
                            />
                        </Box>
                        </TableContainer>
                    </Box>
                    <Box>
                        {isMobile ? 
                        <Box style={{marginBottom: "64px"}}>
                            <Grid container spacing={2} style={{padding: "32px 16px"}}>
                                <Grid item xs={6}>
                                    <Typography className={classes.tableTitle}>Symbol</Typography>
                                    <Typography style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                        {tokenInfo.symbol?.toString().toUpperCase()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.tableTitle}>Name</Typography>
                                    <Typography style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                        {tokenInfo.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} style={{padding: "32px 16px"}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.tableTitle}>Address</Typography>
                                    <CopyToClipboard text={tokenAddress}>
                                        <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0}} endIcon={<FileCopyOutlinedIcon />}>
                                            {tokenAddress.substring(0,8)+"..."+tokenAddress.substring((tokenAddress.length-6), tokenAddress.length)}
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                            <Box style={{display: "flex", justifyContent: "center", paddingBottom: "32px"}}>
                                <Button
                                    onClick={() => window.open("https://etherscan.io/address/"+tokenAddress)}
                                    style={{ background :"#EBF8F0", color: "#2BA55D", fontSize: "16px"}}
                                    startIcon={<OpenInNewIcon />}
                                >
                                    View on Etherscan
                                </Button>
                            </Box>
                        </Box> :
                        <TableContainer component={Paper} style={{ marginTop:  16 ,borderRadius: '16px', boxShadow: "none", marginBottom: 80, padding: 16 }}>
                            <Typography style={{fontSize: 24, fontWeight: "bold", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "16px"}}>Token Information</Typography>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "15%", border: "none"}}>
                                        <Typography className={classes.tableTitle}>Symbol</Typography>
                                    </TableCell>
                                    <TableCell style={{ width: "15%", border: "none"}}>
                                        <Typography className={classes.tableTitle}>Name</Typography>
                                    </TableCell>
                                    <TableCell  style={{ width: "15%", border: "none"}}>
                                        <Typography className={classes.tableTitle}>Address</Typography>
                                    </TableCell>
                                    <TableCell  style={{ width: "55%", border: "none"}}>
                                    </TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ fontSize: 20, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                            {tokenInfo.symbol?.toString().toUpperCase()}
                                        </TableCell>
                                        <TableCell style={{ fontSize: 20, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                            {tokenInfo.name}
                                        </TableCell>
                                        <TableCell style={{ fontSize: 20, fontWeight: "bold", border: "none", paddingTop: 0}}>
                                            <CopyToClipboard text={tokenAddress}>
                                                <Button style={{ fontSize: 20, fontWeight: "bold"}} endIcon={<FileCopyOutlinedIcon />}>
                                                    {tokenAddress.substring(0,8)+"..."+tokenAddress.substring((tokenAddress.length-6), tokenAddress.length)}
                                                </Button>
                                            </CopyToClipboard>
                                        </TableCell>
                                        <TableCell style={{ fontSize: 20, fontWeight: "bold", border: "none", paddingTop: 0}} align="right">
                                            <Button
                                                onClick={() => window.open("https://etherscan.io/address/"+tokenAddress)}
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

export default Token_detail;