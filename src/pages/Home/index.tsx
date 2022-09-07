import React, {useState, useEffect} from "react";
import useStyles from "../../assets/styles";
import Box from "@material-ui/core/Box";
import Swap from "../Swap";
import Card from "@material-ui/core/Card";
import axios from 'axios';
import qs from 'qs'
import { useActiveWeb3React } from '../../hooks'
import { useDerivedSwapInfo, useSwapState } from '../../state/swap/hooks'
import Chart from "../../components/Chart";


const Home = () => {
    const classes = useStyles.home();
    const chartOption = "home";
    // const [currencyA, setCurrencyA] = useState<any>({});
    // const [currencyB, setCurrencyB] = useState<any>({});
    const [currencyData, setCurrencyDataState] = useState<any>({
        orders: []
    }); 
    const { account } = useActiveWeb3React()
    const { currencies } = useDerivedSwapInfo();
    const { typedValue } = useSwapState()

    // useEffect(() => {
    //     setCurrencyA(currencies.INPUT as any); 
    //     setCurrencyB(currencies.OUTPUT as any); 
    // }, [currencies.INPUT?.symbol, currencies.OUTPUT?.symbol])
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
        get0xQuote()
    }, [currencies.INPUT?.symbol, currencies.OUTPUT?.symbol, typedValue])

    return(
        <Box className={classes.mainContainer}>
            <Box className={classes.chartPanel}>
                <Card className={classes.chartContainer}>
                    <Chart chartOption={chartOption} currencyData={currencyData} />
                </Card> 
            </Box>
            <Box>
                <Swap />
            </Box>
        </Box>
    )
}

export default Home;