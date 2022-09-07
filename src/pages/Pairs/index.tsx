import React, { useMemo, useState, useEffect } from 'react'
import useStyles from '../../assets/styles'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import { Pair } from '@uniswap/sdk/dist'
import { useHistory } from 'react-router';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { usePairs } from 'data/Reserves'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { ButtonPrimary } from 'components/Button'
import { currencyId } from 'utils/currencyId'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ExternalLink } from 'theme'
import axios from 'axios'
import Spinner from '../../components/Spinner';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MobileRouter from '../../components/MobileRouter';
import { useAllTokens } from 'hooks/Tokens'
import { BigNumber } from '@ethersproject/bignumber'

const Pairs = () => {
  const classes = useStyles.pairs()
  const History = useHistory();
  // fetch the user's balances of all tracked V2 LP tokens
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const [isLoading, setLoading] = useState(true);
  const v2Pairs = usePairs(tokenPairsWithLiquidityTokens.map(({ tokens }) => tokens))

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const allTokens = useAllTokens()
  // USD Price
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: string }>({})
  const gotoPage = (page:any, pair:Pair) => {
    let liquidity0 = '';
    let liquidity1 = '';
    if(tokenPrices[pair.token0.address]){
        History.push(`/${page}`);
        liquidity0 = JSON.stringify(pair.reserve0?.multiply(tokenPrices[pair.token0.address]!).divide('5000000000').toSignificant(6))
        liquidity1 = JSON.stringify(pair.reserve1?.multiply(tokenPrices[pair.token1.address]!).divide('5000000000').toSignificant(6))
        sessionStorage.setItem("selectedPairInfo", JSON.stringify(pair))
        sessionStorage.setItem("liquidity0", liquidity0)
        sessionStorage.setItem("liquidity1", liquidity1)
      }
  }; 

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
                    [pair.token0.address]: BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)).toString()
                  }))
                }
              })
          } catch (e) {
            console.log(`Axios request failed: ${e}`)
          }
        }
        if (pair.token1.address) {
          try {
            axios
              .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${pair.token1.address}`)
              .then(response => {
                if (pair.token1.address && response.data.market_data?.current_price.usd) {
                  setTokenPrices(prevState => ({
                    ...prevState,
                    [pair.token1.address]: BigNumber.from(Math.ceil(response.data.market_data?.current_price.usd * 10000000000)).toString()
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
  }, [allV2PairsWithLiquidity.length])
  useEffect(() => {
    if(allV2PairsWithLiquidity.length !== 0 || Object.values(allTokens).length === 0)
      setLoading(false)
  }, [allV2PairsWithLiquidity.length])
  return (
    <Box className={classes.mainContainer}>
      <Spinner isLoading={isLoading} />
        {isMobile && <Box style={{border: "1px solid #6BC08E"}}><MobileRouter classes={classes} /></Box>}
        <Typography style={{fontSize: "34px", fontWeight: 300, marginBottom: "24px"}}>Pairs</Typography>
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
                  <TableCell onClick={() => gotoPage(`pairs/${pair.liquidityToken.address}`, pair)}>
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
                  <TableCell onClick={() => gotoPage(`pairs/${pair.liquidityToken.address}`, pair)} align="right">
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
                      style={{
                        maxWidth: "120px",
                        float: "right"
                      }}
                    >
                      + ADD MORE
                    </ButtonPrimary>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  )
}

export default Pairs
