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
import Select from '@material-ui/core/Select';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import useMediaQuery from '@material-ui/core/useMediaQuery';

  /* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
interface liquidityProps {
    liquidity: string
}
const Fastchart = ({liquidity} : liquidityProps) => {
    const classes = useStyles.chart();
    const [activeStatus, setActiveStatus] = useState<number>(1);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [chartdata, setChartData] = useState([]);

    const [selection, setSelectValue] = React.useState<string | number>('');
    // const [open, setOpen] = React.useState(false);

    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectValue(event.target.value as number);
        changeStatus(event.target.value as number)
    };
    
    const changeStatus = async (newStatus:number) => {
        setActiveStatus(newStatus);
            if(newStatus === 1){ //1w
                getChartData('usd', 7, (data:any) => {
                    setChartData(data);
                });
            }else if(newStatus == 2){ //1m
                getChartData('usd', 30, (data:any) => {
                    setChartData(data);
                });
            }else if(newStatus == 3){  //all
                getChartData('usd', 'max', (data:any) => {
                    setChartData(data);
                });
            }
    }
    function getChartData(currency:any, duration:any, cb:any){
        try {
            axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc888a0ab4831a29e6ca432babf52e353d23db3c2/market_chart/?vs_currency=${currency}&days=${duration}`)
            .then(response => {
                cb(response.data.market_caps);
            })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }
    function generateChartData(chartdata:any) {
        let chartData = [];
        // current date
        var data = {

        }
        for (var i = 0; i < chartdata.length; i++) {
            if(chartdata[i]){
                let newDate = new Date(chartdata[i][0]);
                // each time we add one minute
                // newDate.setMinutes(newDate.getMinutes() + i);
                // some random number
                let liquidity = chartdata[i][1];
                // let percent = Math.round(currencyA[i][1]/10);
                // add data item to the array\
                data ={
                    date: newDate,
                    liquidity: liquidity
                }
                chartData.push({
                    date: newDate,
                    liquidity: liquidity
                });
            }else{
                chartData.push(data);
            }
        }
        return chartData;
        
    }

    useEffect(() => {
        if(chartdata && chartdata.length){
            let chart = am4core.create("fastchartdiv", am4charts.XYChart);
            chart.paddingRight = 20;
    
            chart.data = generateChartData(chartdata);
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
            series.dataFields.valueY = "liquidity";
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
    }, [chartdata]);
    useEffect(() => {
        getChartData('usd', 1, (data:any) => {
            setChartData(data);
        });
    }, [])
    return(
        <>
            <Box className={classes.chartHeader}>
                <Box>
                    <Typography style={{fontSize: 14, fontWeight: 500, color: "#9DD1B2"}}>Liquidity</Typography>
                    <Typography style={{fontSize:48, fontWeight: 500}}>${liquidity ? parseInt(liquidity).toLocaleString() : ''}</Typography>
                </Box>
                {!isMobile && <Box>
                    <Button 
                        onClick={() => changeStatus(1)}
                        className={activeStatus === 1 ? classes.activeStatus : ""}
                    >
                        {"1W"} 
                    </Button>
                    <Button 
                        onClick={() => changeStatus(2)}
                        className={activeStatus === 2 ? classes.activeStatus : ""}
                    >
                        {"1M"} 
                    </Button>
                    <Button 
                        onClick={() => changeStatus(3)}
                        className={activeStatus === 3 ? classes.activeStatus : ""}
                    >
                        {"ALL"} 
                    </Button>
                </Box>}
            </Box>
            {isMobile && 
                    <Box style={{paddingTop: 8}}>
                        <Select
                            native
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
                                <option value={1}>1W</option>
                                <option value={2}>1M</option>
                                <option value={3}>ALL</option>
                        </Select>
                    </Box>
                    }
            <div id="fastchartdiv" style={{ width: "100%", height: 300 }}></div>
        </>
    )
}
export default Fastchart;
