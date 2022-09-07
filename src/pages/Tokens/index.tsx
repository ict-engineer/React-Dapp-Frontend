import React, {useMemo, useEffect, useState} from "react";
import useStyles from "../../assets/styles";
import Box from "@material-ui/core/Box";
import { Typography } from '@material-ui/core';
import { Pair } from '@uniswap/sdk/dist'
import { useHistory } from 'react-router';

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { unwrappedToken } from 'utils/wrappedCurrency'
import CurrencyLogo from '../../components/CurrencyLogo'
import { usePairs } from 'data/Reserves'
import axios from 'axios';
import Spinner from '../../components/Spinner';
import MobileRouter from '../../components/MobileRouter';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAllTokens } from 'hooks/Tokens'
import { BigNumber } from '@ethersproject/bignumber'

const Tokens = () => {
    const classes = useStyles.grid();
    const tokenClasses = useStyles.tokens();
    const History = useHistory();
    const [topTokens, setTopTokens] = useState<any>([]);
    const [mergedTokens, setMergedTokens] = useState<any>([]);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const trackedTokenPairs = useTrackedTokenPairs()
    const tokenPairsWithLiquidityTokens = useMemo(
        () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
        [trackedTokenPairs]
    )
    const [isLoading, setLoading] = useState(true);

    const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

    const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

    // USD Price
    const [tokenPrices, setTokenPrices] = useState<{ [key: string]: string }>({})

    const gotoPage = (page:any) => {
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
                    setTokenPrices(prevState => ({
                        ...prevState,
                        [pair.token0.address]: BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)).toString()
                      }))
                    let data = {
                        token: pair.token0,
                        reserve: (pair as any)?.reserve0,
                        current_price: response.data.market_data.current_price.usd
                    }
                    tokens.push(data)
                }
            }
            if (pair.token1.address) {
                let response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token1.address}`);
                if (pair.token1.address && response.data.market_data?.current_price.usd) {
                    setTokenPrices(prevState => ({
                        ...prevState,
                        [pair.token1.address]: BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)).toString()
                      }))
                    let data = {
                        token: pair.token1,
                        reserve: (pair as any)?.reserve1,
                        current_price: response.data.market_data.current_price.usd
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
                    lookupObject[tokenAddress].reserve.add(originalArray[i].reserve)
            }
            for(i in lookupObject){
                newArr.push(lookupObject[i])
            }
            return newArr
        }
        var uniqueArr = removeDuplicates(topTokens, 'address')
        setMergedTokens(uniqueArr)
       
        if(topTokens.length !== 0 || Object.values(allTokens).length === 0)
            setLoading(false)
      }, [topTokens.length])
    return(
        <>
        <Spinner isLoading={isLoading} />
        {isMobile && <Box style={{border: "1px solid #6BC08E", margin: "0px 16px"}}><MobileRouter classes={classes} /></Box>}
        <Box className={tokenClasses.mainContainer}>
            <Typography style={{fontSize: "34px", fontWeight: 300, marginBottom: "24px"}}>Tokens</Typography>
            <TableContainer component={Paper} style={{ borderRadius: '16px' }}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                        <Typography className={classes.tableTitle}>Name</Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography className={classes.tableTitle}>Symbol</Typography>
                        </TableCell>
                        <TableCell align="right">
                        <Typography className={classes.tableTitle}>Liquidity</Typography>
                        </TableCell>
                        {/* <TableCell align="right">
                        <Typography className={classes.tableTitle}>Volume(24H)</Typography>
                        </TableCell> */}
                        <TableCell align="right">
                        <Typography className={classes.tableTitle}>Price</Typography>
                        </TableCell>
                        {/* <TableCell align="right">
                        <Typography className={classes.tableTitle}>Change(24H)</Typography>
                        </TableCell> */}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {mergedTokens.map((item:any) => (
                        <TableRow key={item.token.address} onClick={() => gotoPage(`tokens/${item.token.address}`)}>
                            <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center'}}>
                                    <CurrencyLogo
                                    currency={unwrappedToken(item.token)}
                                    />
                                    <div style={{paddingLeft: 8}}>{unwrappedToken(item.token).name}</div>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                {unwrappedToken(item.token).symbol}
                            </TableCell>
                            <TableCell align="right">
                                US${' '}
                                {tokenPrices[item.token.address]
                                ? item.reserve
                                    .multiply(tokenPrices[item.token.address])
                                    .divide('5000000000')
                                    .toSignificant(6)
                                : '...'}
                            </TableCell>
                            {/* <TableCell align="right">
                                
                            </TableCell> */}
                            <TableCell align="right">
                                US$ {item.current_price}
                            </TableCell>
                            {/* <TableCell align="right">
                                
                            </TableCell> */}
                        </TableRow>

                       
                    ))}
                    
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
        </>
    )
}

export default Tokens;