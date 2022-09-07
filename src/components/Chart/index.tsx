import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Typography from "@material-ui/core/Typography";
import axios from 'axios'
import useStyles from "../../assets/styles";
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Select from '@material-ui/core/Select';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MenuItem from '@material-ui/core/MenuItem';

  /* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
interface ChartProps {
    chartOption?: string,
    currencyData?: any
}


const Chart = ({ chartOption, currencyData } : ChartProps) => {
    const classes = useStyles.chart();
    const [activeStatus, setActiveStatus] = useState<number>(1);
    const { currencies } = useDerivedSwapInfo();
    const [coinA_info, setCoinA] = useState({});
    const [coinB_info, setCoinB] = useState({});
    const [coinAImage, setImageA] = useState();
    const [coinBImage, setImageB] = useState();

    // let coinAImage = '';
    // let coinBImage = '';

    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [chartdataA, setChartDataA] = useState([]);
    const [chartdataB, setChartDataB] = useState([]);

    const [selection, setSelectValue] = React.useState<number>(1);
    const handleChangeSelect = (event: any) => {
        setSelectValue(event.target.value as number);
        changeStatus(event.target.value as number)
    };
    const changeStatus = async (newStatus:number) => {
        setActiveStatus(newStatus)
        if(chartOption === "home"){
            getChartData((currencies.INPUT as any)?.address, 'usd', newStatus, (data:any) => {
                setChartDataA(data);

            });
            getChartData((currencies.OUTPUT as any)?.address, 'usd', newStatus, (data:any) => {
                setChartDataB(data);
            });
        }
    }
    function getChartData(address:any, currency:any, status:any, cb:any){
        let duration = '1';
        if(chartOption === 'home'){
            if(status === 1 || status === "1"){
                duration = '1'
            }else if(status === 2 || status === "2"){
                duration = '7'
            }else{
                duration = '30'
            }
        }
        let url = '';
        if(address === '' || address === undefined){
            url = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${currency}&days=${duration}`;
        }
        if(address !== undefined){
            url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart/?vs_currency=${currency}&days=${duration}`
        }
        try {
            axios.get(url)
            .then(response => {
                cb(response.data.prices);
            })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }
    function generateChartData(data_A:any, data_B:any) {
        let count = data_A.length;
        if((data_A.length > data_B.length) || data_A.length === 0){
            count = data_B.length;
        }else{
            count = data_A.length;
        }
        let chartData = [];
        // current date
        var data = {

        }
        for (var i = 0; i < count; i++) {
            if(data_A[i]){
                let newDate = new Date(data_A[i][0]);
                // each time we add one minute
                // newDate.setMinutes(newDate.getMinutes() + i);
                // some random number
                let percent = 0;
               
                    percent = data_A[i][1]/data_B[i][1];
                // let percent = Math.round(currencies.INPUT[i][1]/10);
                // add data item to the array\
                data ={
                    date: newDate,
                    percent: percent
                }
                chartData.push({
                    date: newDate,
                    percent: percent
                });
            }else{
                chartData.push(data);
            }
        }
        return chartData;
        
    }

    useEffect(() => {
        if(chartdataA && chartdataB && chartdataA.length && chartdataB.length){
            let chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.paddingRight = 20;
    
            chart.data = generateChartData(chartdataA, chartdataB);
            let gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color("#65d7a7"));
            gradient.addColor(am4core.color("white"));
            gradient.rotation = 90;
    
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.baseInterval = {
                "timeUnit": "minute",
                "count": 1
            };
            dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
            dateAxis.renderer.grid.template.disabled = true;
            // dateAxis.renderer.labels.template.disabled = true;
    
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            // valueAxis.tooltip.disabled = true;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            // valueAxis.title.text = "Unique visitors";
    
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "percent";
            // series.tooltipText = "Visits: [bold]{valueY}[/]";
            series.fillOpacity = 0.3;
            series.fill = gradient;
            series.stroke = am4core.color("#65d7a7")
    
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.opacity = 0;
            // chart.scrollbarX = new am4charts.XYChartScrollbar();
            // chart.scrollbarX.series.push(series);
    
    
            dateAxis.start = 0.8;
            dateAxis.keepSelection = false;

        }   
    }, [chartdataA, chartdataB]);
    useEffect(() => {
        getChartData((currencies.INPUT as any)?.address, "usd", activeStatus, (data:any) => {
            setChartDataA(data);
        });
        

    }, [(currencies.INPUT as any)?.address])
    useEffect(() => {
        getChartData((currencies.OUTPUT as any)?.address, "usd", activeStatus, (data:any) => {
            setChartDataB(data);
        });
    }, [(currencies.OUTPUT as any)?.address])
    useEffect(() => {
        let url = '';  
        if(currencies.INPUT?.symbol === 'ETH'){
            url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false';
        }
        else if((currencies.INPUT as any)?.address){
            url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${(currencies.INPUT as any)?.address}`;
        }
        try {
            axios.get(url)
            .then(response => {
                if(response.data && chartOption !== "token_detail" && chartOption !== "pair_detail"){
                    if(currencies.INPUT?.symbol === 'ETH'){
                        setCoinA(response.data[0]); 
                        setImageA(response.data[0].image);
                        // coinAImage = response.data[0].image
                    }else{
                        setCoinA(response.data); 
                        setImageA(response.data.image?.small);
                        // coinAImage = response.data.image?.small
                    }
                } else {
                    console.log("------------- something went wrong! -----------------");
                }
                });
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }, [currencies.INPUT?.symbol, (currencies.INPUT as any)?.address]);
    useEffect(()=>{
        let url = ''
        if(currencies.OUTPUT?.symbol === 'ETH'){
            url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false';
        }
        else if((currencies.OUTPUT as any)?.address){
            url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${(currencies.OUTPUT as any)?.address}`;
        }
        try {
            axios.get(url)
            .then(response => {
                if(response.data && chartOption !== "token_detail" && chartOption !== "pair_detail"){
                    if(currencies.OUTPUT?.symbol === 'ETH'){
                        setCoinB(response.data[0]); 
                        setImageB(response.data[0].image)
                        // coinBImage = response.data[0].image
                    }else{
                        setCoinB(response.data); 
                        setImageB(response.data.image?.small);
                        // coinBImage = response.data.image?.small
                    }
                } else {
                    console.log("------------- something went wrong! -----------------");
                }
                });
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }, [(currencies.OUTPUT as any)?.address, currencies.OUTPUT?.symbol])
    const Component = () => {
        if(chartOption === "home"){
            let status = "";
            if(!isMobile){
                switch(activeStatus){
                    case 1:
                        status = "24 Hours";
                        break;
                    case 2:
                        status = "1 Week";
                        break;
                    case 3:
                        status = "1 Month";
                        break;
                    default:
                        status = "Unknown";
                }
            }else{
                switch(selection){
                    case 1:
                        status = "24 Hours";
                        break;
                    case 2:
                        status = "1 Week";
                        break;
                    case 3:
                        status = "1 Month";
                        break;
                    default:
                        status = "Unknown";
                }
            }
            let current_percent = Math.round((currencyData?.guaranteedPrice - currencyData?.price) / currencyData?.guaranteedPrice * 100);
            return (
                <>
                    
                {/* {coinBImage ?  */}
                    <Box style={{display: "flex", alignItems: "center"}}>
                        {coinAImage && <img src={coinAImage} alt="" style={{width: 32, height: 32}} />}
                        {coinBImage && <img src={coinBImage} alt="" style={{marginLeft: "-5px", marginRight: "10px", width: 32, height: 32}} />}
                        <Typography style={{fontSize: 18, fontWeight: 500}}>{(coinA_info as any).symbol ? (coinA_info as any).symbol?.toUpperCase() : ''}{(coinB_info as any).symbol ? ' / '+(coinB_info as any).symbol?.toUpperCase() : ''}</Typography>
                    </Box> 
                {/* : ''} */}
                {current_percent ? 
                    <Box>
                        <Typography className={classes.currentChartValue}>{parseInt(currencyData?.guaranteedPrice).toLocaleString()}<span style={{marginLeft: 20}}>{(coinB_info as any).symbol?.toUpperCase()}</span></Typography>
                        <Box className={classes.changePercent}>
                            <Typography style={{color: "#2BA55D"}}>{parseInt(currencyData?.price).toLocaleString()}{"("+current_percent+"%)"}<span style={{marginLeft: 10}}>{(coinB_info as any).symbol?.toUpperCase()}</span></Typography>
                            <Typography style={{fontFamily: "Raleway"}}>Past {status}</Typography>
                        </Box>
                    </Box> : ''}
                    {isMobile && 
                    <Box style={{paddingTop: 8}}>
                        <Select
                            value={selection}
                            onChange={handleChangeSelect}
                            style={{
                                borderRadius: 40,
                                border: "1px solid #9DD1B2",
                                padding: "0px 16px",
                                color: "#9DD1B2",
                            }}
                            IconComponent={
                                () => (<KeyboardArrowDownIcon style={{color: "#9DD1B2"}} />)
                            }
                            disableUnderline
                        >   
                            <MenuItem value={1}>24H</MenuItem>
                            <MenuItem value={2}>1W</MenuItem>
                            <MenuItem value={3}>1M</MenuItem>
                        </Select>
                    </Box>
                    }
                </>
            );
        } 
        else {
            return(
                <div>123321</div>
            )
        }
    }
    return(
        <>
            <Box className={classes.chartHeader}>
                <Box>
                    <Component />
                </Box>
               {!isMobile &&  <Box style={{paddingRight: 20}}>
                    <Button 
                        onClick={() => changeStatus(1)}
                        className={activeStatus === 1 ? classes.activeStatus : ""}
                    >
                        {"24H"} 
                    </Button>
                    <Button 
                        onClick={() => changeStatus(2)}
                        className={activeStatus === 2 ? classes.activeStatus : ""}
                    >
                        {"1W"}  
                    </Button>
                    <Button 
                        onClick={() => changeStatus(3)}
                        className={activeStatus === 3 ? classes.activeStatus : ""}
                    >
                        {"1M"} 
                    </Button>
                </Box>}
            </Box>
            <div id="chartdiv" style={{ width: "100%", height: 300 }}></div>
        </>
    )
}
export default Chart;
