import React, {useMemo, useEffect, useState} from 'react';
// ** Import Material-Ui DataGrid
import useStyles from "../../assets/styles";
import { Card, Typography } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import Fastchart from "../../components/Fastchart";
import Barchart from "../../components/Barchart";

import * as am4core from "@amcharts/amcharts4/core";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Spinner from '../../components/Spinner';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import RadarChart from "../../components/Radarchart";
import { useHistory } from 'react-router';

import { Pair } from '@uniswap/sdk/dist'
import CurrencyLogo from '../../components/CurrencyLogo'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePairs } from 'data/Reserves'
import { unwrappedToken } from 'utils/wrappedCurrency'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MobileRouter from '../../components/MobileRouter';
// import MasonryList from '../../components/MasonryList';
import axios from 'axios';
import { useAllTokens } from 'hooks/Tokens'
import { BigNumber } from '@ethersproject/bignumber'

am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

const Overview = () => {

    // ** Declare Maintainers
    const classes = useStyles.grid();
    const overviewClasses = useStyles.overview();
    const History = useHistory();
    const [fastData, setFastData] = useState<any>({});
    const [etherData, setEtherData] = useState<any>({});
    const [topTokens, setTopTokens] = useState<any>([]);
    const [mergedTokens, setMergedTokens] = useState<any>([]);
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )
    const [isLoading, setLoading] = useState(true);
    const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    const isMobile = useMediaQuery('(max-width: 1024px)');
    const gotoPage = (page:any) => {
        sessionStorage.setItem("activeDrawer", page)
        History.push(`/${page}`);
    };
    const allTokens = useAllTokens()
    useEffect(() => {
        const getTokenPrices = async () => {
            let tokens :any = [];
          allV2PairsWithLiquidity.forEach(async pair => {
            if (pair.token0.address) {
              let response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token0.address}`);
              if (pair.token0.address && response.data.market_data?.current_price.usd) {
                    // setTokenPrices(prevState => ({
                    //     ...prevState,
                    //     [pair.token0.address]: BigInt(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)),
                    // }))
                    let data = {
                        name: unwrappedToken(pair?.token0).symbol,
                        token: pair.token0,
                        liquidity: (pair as any)?.reserve0.multiply(BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000))).divide('5000000000').toSignificant(6),
                        current_price: response.data.market_data.current_price.usd,
                        price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
                        total_volume: response.data.market_data.total_volume.usd
                    }
                    tokens.push(data)
                }
            }
            if (pair.token1.address) {
                let response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token1.address}`);
                if (pair.token1.address && response.data.market_data?.current_price.usd) {
                    // setTokenPrices(prevState => ({
                    //     ...prevState,
                    //     [pair.token1.address]: BigInt(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)),
                    // }))
                    let data = {
                        name: unwrappedToken(pair?.token1).symbol,
                        token: pair.token1,
                        liquidity: (pair as any)?.reserve1.multiply(BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000))).divide('5000000000').toSignificant(6),
                        current_price: response.data.market_data.current_price.usd,
                        price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
                        total_volume: response.data.market_data.total_volume.usd
                    }
                    tokens.push(data)
                }
            }
          })
          setTopTokens(tokens);
        }
        getTokenPrices()
      }, [allV2PairsWithLiquidity.length])
    useEffect(() => {
        function removeDuplicates(originalArray:any, prop:any){
            var newArr = [];
            var lookupObject:any = {};

            for(var i in originalArray){
                let tokenAddress = originalArray[i]?.token[prop];
                if (!lookupObject[tokenAddress])
                    lookupObject[tokenAddress] = originalArray[i];
                else
                    lookupObject[tokenAddress].reserve?.add(originalArray[i].reserve)
            }
            for(i in lookupObject){
                newArr.push(lookupObject[i])
            }
            return newArr
        }
        var uniqueArr = removeDuplicates(topTokens, 'address')
        if(uniqueArr.length > 5)
            uniqueArr = uniqueArr.splice(0,5)
        setMergedTokens(uniqueArr)

        // if(allV2PairsWithLiquidity.length < 5){
        //     if(uniqueArr.length === allV2PairsWithLiquidity.length){
        //         setLoading(false)
        //     }
        // }else{
            if(allV2PairsWithLiquidity.length > 0 || uniqueArr.length > 0 || Object.values(allTokens).length === 0)
                setLoading(false)
        // }
      }, [topTokens.length])
    useEffect(() => {
      try {
        axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc888a0ab4831a29e6ca432babf52e353d23db3c2`)
        .then(response => {
            setFastData(response.data)
        })
      } catch (e) {
          console.log(`Axios request failed: ${e}`)
      }
      try {
        axios.get(`https://api.coingecko.com/api/v3/coins/ethereum`)
        .then(response => {
            setEtherData(response.data)
        })
      } catch (e) {
          console.log(`Axios request failed: ${e}`)
      }
    }, [])
    return(
        <>
            <Spinner isLoading={isLoading} />
            {isMobile && <Box style={{border: "1px solid #6BC08E", margin: "0px 16px"}}><MobileRouter classes={classes} /></Box>}
            <Box className={overviewClasses.mainContainer}>
                <Box><Typography style={{fontSize: "34px", fontWeight: 300}}>Welcome to FASTSWAP</Typography></Box>
                <Box className={overviewClasses.headerTitle}>
                    <Typography style={{marginRight: "40px", fontFamily: "Raleway"}}>FAST Price: US${fastData ? fastData.market_data?.current_price.usd : 0}</Typography>
                    <Typography style={{marginRight: "40px", fontFamily: "Raleway"}}>ETH Price: US${etherData ? etherData.market_data?.current_price.usd : 0}</Typography>
                    <Typography style={{marginRight: "40px", fontFamily: "Raleway"}}>Transactions (24H): {fastData ? fastData.market_data?.market_cap_change_24h.toLocaleString() : 0}</Typography>
                </Box>
                <Grid container spacing={2} style={{marginBottom: "10px"}}>
                    <Grid item xs={12} sm={6} style={{zIndex: 1400}}>
                        <Card className={overviewClasses.chartContainer}>
                            <Fastchart liquidity={fastData.market_data?.market_cap.usd} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{zIndex: 1450}}>
                        <Card className={overviewClasses.chartContainer}>
                            <Barchart volume={fastData.market_data?.total_volume.usd} />
                        </Card>
                    </Grid>
                </Grid>
                <Card className={overviewClasses.chartContainer}>
                    <Typography style={{color: "#9DD1B2", fontSize: 14, fontWeight: 500}}>Top Tokens</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <RadarChart topTokens={mergedTokens} />
                            
                        </Grid>
                        {!isMobile && <Grid item xs={12} sm={8} style={{display: "flex"}}>
                            <TableContainer component={Paper} className={overviewClasses.leftDivider}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Symbol</TableCell>
                                            <TableCell align="right">Liquidity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Changes(24h)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {mergedTokens.map((row:any) => (
                                        <TableRow>
                                            <TableCell>
                                                <div style={{ display: 'flex'}}>
                                                    <CurrencyLogo
                                                    currency={unwrappedToken(row?.token)}
                                                    />
                                                    {unwrappedToken(row?.token).symbol}
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                {unwrappedToken(row?.token).symbol}
                                            </TableCell>
                                            <TableCell align="right">
                                                US${' '}
                                                {row?.liquidity}
                                            </TableCell>
                                            <TableCell align="right">
                                                US$ {row?.current_price}
                                            </TableCell>
                                            {row?.price_change_percentage_24h > 0 ? 
                                                <TableCell align="right" style={{color: "#6BC08E"}}>{row?.price_change_percentage_24h}%</TableCell> 
                                            : <TableCell align="right" style={{color: "#F16868"}}>{row?.price_change_percentage_24h}%</TableCell>
                                            }
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                <Button onClick={() => gotoPage('tokens')} color="primary" style={{marginLeft: "45%", marginTop: "30px"}}><Typography style={{fontSize: "16px", fontWeight: 500}}>SEE ALL TOKENS</Typography></Button>
                            </TableContainer>
                        </Grid>}
                    </Grid>
                </Card>
              
                <Box style={{marginBottom: "24px"}}></Box>
            </Box>
        </>
    )
}

export default Overview;    