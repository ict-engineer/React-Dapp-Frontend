import React, {useEffect, useState} from "react";
import useStyles from "../../assets/styles";
import Box from "@material-ui/core/Box";
import Swap from "../Swap";
import Card from "@material-ui/core/Card";
import Chart from "../../components/Chart";
import { useActiveWeb3React } from '../../hooks'
import { useDerivedSwapInfo, useSwapState } from '../../state/swap/hooks'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import fasttoken from "../../assets/images/landing/fasttoken.png";
import axios from 'axios';
import qs from 'qs'
import useMediaQuery from '@material-ui/core/useMediaQuery';

const SwapPage = () => {
    const classes = useStyles.swappage();
    const chartOption = "home";
    const [currencyData, setCurrencyDataState] = useState<any>({
        orders: []
    }); 
    const { account } = useActiveWeb3React()
    const { currencies } = useDerivedSwapInfo();
    const { typedValue } = useSwapState()
    const top_tokens_rows:any = [];
    const isMobile = useMediaQuery('(max-width: 1024px)');
    
    currencyData.orders.map((item:any, idx:number) => {
        let data ={
            id: idx+1,
            comparison: item.source,
            rate: (item.makerAmount / item.takerAmount).toFixed(4),
            difference: ((item.makerAmount / item.takerAmount-currencyData.price)/currencyData.price*100).toFixed(4),
        }
        top_tokens_rows.push(data)
    })
    useEffect(() => {
        let formated_value = typedValue
        
        for(let i = 0; i < (18 - typedValue.length); i++){
            formated_value += "0"
        }
        
        const params = {
            sellToken: (currencies.INPUT as any)?.address || currencies.INPUT?.symbol,
            sellAmount: formated_value,
            buyToken: (currencies.OUTPUT as any)?.address || currencies.OUTPUT?.symbol
          }

        const get0xQuote = async () => {
            try {
              const response = await axios.get(
                `https://api.0x.org/swap/v1/quote?${qs.stringify({ ...params, takerAddress: account })}`
              )
              setCurrencyDataState(response.data)
            } catch {
              try {
                const response = await axios.get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)
                setCurrencyDataState(response.data)
              } catch (error) {
                console.log("Error to get currency table data")
              }
            }
        }
        if(typedValue)
            get0xQuote()
    }, [currencies.INPUT?.symbol, currencies.OUTPUT?.symbol, typedValue])
    return(
        <>
            <Box className={classes.mainContainer}>
                {!isMobile && <Box className={classes.chartPanel}>
                    <Card className={classes.chartContainer}>
                        <Chart chartOption={chartOption} currencyData={currencyData} />
                    </Card> 
                </Box>}
                <Box className={classes.swapContainer}>
                    <Swap />
                </Box>
            </Box>
            {isMobile && 
                <Box className={classes.chartPanel}>
                    <Card className={classes.chartContainer}>
                        <Chart chartOption={chartOption} currencyData={currencyData} />
                    </Card> 
                </Box>
            }
            {/* <Box className={classes.mainContainer}>
                <Box className={classes.chartPanel}>
                    {top_tokens_rows.length !==0 ? 
                        <TableContainer component={Paper} style={{marginTop: "24px"}}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography className={classes.tableTitle}>Rate comparison</Typography></TableCell>
                                        <TableCell align="right"><Typography className={classes.tableTitle}>{currencies.INPUT?.symbol} / {currencies.OUTPUT?.symbol}</Typography></TableCell>
                                        <TableCell align="right"><Typography className={classes.tableTitle}>Difference</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {top_tokens_rows.map((row:any) => (
                                    <TableRow key={row.id}>
                                        <TableCell style={{display: "flex", alignItems: "center"}}><img alt="fasttoken" src={fasttoken} style={{marginRight: "5px"}} />{row.comparison}</TableCell>
                                        <TableCell align="right">{row.rate}</TableCell>
                                        {row.difference < 0 ? 
                                            <TableCell align="right" style={{color: "#F16868"}}>{row.difference}%</TableCell> 
                                        : <TableCell align="right" style={{color: "#6BC08E"}}>{row.difference}%</TableCell>
                                        }  
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer> : ''}
                </Box> 
            </Box>*/}
        </>
    )
}

export default SwapPage;