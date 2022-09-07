import React, { useMemo, useState, useEffect } from 'react'
import useStyles from '../../assets/styles'
import Box from '@material-ui/core/Box'
import Pool from '../Pool'
import Card from '@material-ui/core/Card'
import Chart from '../../components/Chart'
import { Link, NavLink } from 'react-router-dom'
import { JSBI, Pair } from '@uniswap/sdk/dist'
import { BigNumber } from '@ethersproject/bignumber'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePairs } from 'data/Reserves'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ExternalLink } from 'theme'
import axios from 'axios'
import Grid from "@material-ui/core/Grid";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const AddliquidityPage = () => {
  const classes = useStyles.poolpage()
  const isMobile = useMediaQuery('(max-width: 1024px)');
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )

  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))


  // USD Price
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: bigint }>({})

  //   allV2PairsWithLiquidity.forEach(async pair => {
  //     try {
  //       axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token0.address}`).then(response => {
  //           setTokenPrices((prev) => {...prev, [pair.token0.address]:  String(response.data.market_data?.current_price.usd || 0)})
  //         // tokenPrices[pair.token0.address] =
  //         console.log(tokenPrices, response.data.market_data?.current_price.usd)
  //       })
  //     } catch (e) {
  //       console.log(`Axios request failed: ${e}`)
  //     }
  //   })

  useEffect(() => {
    const getTokenPrices = async () => {
      allV2PairsWithLiquidity.forEach(async pair => {
        if (pair.token0.address) {
          try {
            axios
              .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token0.address}`)
              .then(response => {
                if (pair.token0.address && response.data.market_data?.current_price.usd) {
                  setTokenPrices(prevState => ({
                    ...prevState,
                    [pair.token0.address]: BigInt(Math.ceil(response.data.market_data?.current_price.usd * 10000000000))
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

  return (
    <Grid container className={classes.mainContainer} direction={ isMobile ? "column-reverse" : "row" }>
      <Grid item xs={12} sm={7} className={classes.tablePanel} style={{ padding: 8, background: "rgba(255, 255, 255, .4)" }}>
        <Grid container spacing={2} style={{alignItems: "baseline"}}>
          {!isMobile && <Grid item xs={1} sm={6}>
            <Typography style={{ fontSize: 34, fontWeight: 300}}>My Liquidity</Typography>
          </Grid>}
          <Grid item xs={12} sm={6}>
            <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 32 }}>
              <Typography style={{ fontFamily: 'Raleway' }}>Don't see a pool you joined?</Typography>
              <Button style={{ color: '#2BA55D', background: 'transparent' }}>IMPORT IT</Button>
            </Box>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ borderRadius: '16px' }}>
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
              {allV2PairsWithLiquidity.map(pair => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={5} style={{ padding: 8 }}>
        <Pool />
        <Box style={{ marginTop: 26, background: "rgba(255, 255, 255, .4)" }}>
          <Typography className={classes.poolTitle}>By adding liqiodity, you will earn fees proportional</Typography>
          <Typography className={classes.poolTitle}>to your share of the pool on all trades for this pair.</Typography>
          <Typography className={classes.poolTitle}>Fees are added to the pool, accrue in real time,</Typography>
          <Typography className={classes.poolTitle}>and can be claimed when you withdraw your</Typography>
          <Typography className={classes.poolTitle}>liquidity.</Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AddliquidityPage
