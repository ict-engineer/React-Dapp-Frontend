import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from 'axios'
import useStyles from "../../assets/styles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Stockchart from '../Stockchart'

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

interface ChartProps {
    chartOption?: string,
    chartData?: string
}
const DetailChart = ({ chartOption, chartData }: ChartProps) => {
    const classes = useStyles.chart();
    const [activeStatus, setActiveStatus] = useState<number>(1);
    const [chartdata, setChartData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [selection, setSelectValue] = React.useState<number>(1);
    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectValue(event.target.value as number);
        changeStatus(event.target.value as number)
    };
    const handleChangeTab = (event: any, newActiveTab: any) => {
        setActiveTab(newActiveTab)
    }
    useEffect(() => {
        getChartData(activeTab, chartData, 'usd', activeStatus, (data: any) => {
            setChartData(data);
        });
    }, [activeTab])

    const changeStatus = async (newStatus: number) => {
        setActiveStatus(newStatus);

        getChartData(activeTab, chartData, 'usd', newStatus, (data: any) => {
            setChartData(data);
        });

    }
    function getChartData(option: any, address: any, currency: any, status: any, cb: any) {
        let duration = '1';

        if (status === 1) {
            duration = '7'
        } else if (status === 2) {
            duration = '30'
        } else {
            duration = 'max'
        }

        let url = '';
        if (address === '' || address === undefined) {
            url = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${currency}&days=${duration}`;
        }
        if (address !== undefined) {
            url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart/?vs_currency=${currency}&days=${duration}`
        }
        try {
            axios.get(url)
                .then(response => {
                    if (option === 0) {
                        cb(response.data.market_caps)
                    } else if (option === 1) {
                        cb(response.data.total_volumes)
                    } else if(option === 2) {
                        cb(response.data.prices);
                    }
                })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }
    function generateChartData(data: any) {
        let count = data.length;
        let chartData = [];
        // current date
        var item = {

        }
        for (var i = 0; i < count; i++) {
            if (data[i]) {
                let newDate = new Date(data[i][0]);
                // each time we add one minute
                // newDate.setMinutes(newDate.getMinutes() + i);
                // some random number
                let percent = 0;

                percent = data[i][1]

                // let percent = Math.round(currencyA[i][1]/10);
                // add data item to the array\
                item = {
                    date: newDate,
                    percent: percent
                }
                chartData.push({
                    date: newDate,
                    percent: percent
                });
            } else {
                chartData.push(item);
            }
        }
        return chartData;

    }

    useEffect(() => {
        if (chartdata && chartdata.length) {
            let chart = am4core.create("chartdiv", am4charts.XYChart);
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
    }, [chartdata]);

    const Component = () => {
        if (chartOption === "token_detail") {
            return (
                <div className={classes.detailChartTabs}>
                    <Tabs
                        value={activeTab}
                        onChange={handleChangeTab}
                        className={classes.tabList}
                    >
                        <Tab label="Liquidity" />
                        <Tab label="Volume" />
                        <Tab label="Price" />
                    </Tabs>
                </div>
            );
        } else if (chartOption === "pair_detail") {
            return (
                <div className={classes.detailChartTabs}>
                    <Tabs
                        value={activeTab}
                        onChange={handleChangeTab}
                        className={classes.tabList}
                    >
                        <Tab label="Liquidity" />
                        <Tab label="Volume" />
                        <Tab label="Price" />
                        {/* <Tab label="ETH-FAST" />
                        <Tab label="FAST-ETH" /> */}
                    </Tabs>
                </div>
            );
        } else {
            return (
                <div>123321</div>
            )
        }
    }
    return (
        <>
            <Box className={classes.chartHeader}>
                <Box>
                    <Component />
                    {isMobile &&
                        <Box style={{ paddingTop: 8, paddingLeft: 24 }}>
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
                                    () => (<KeyboardArrowDownIcon style={{ color: "#9DD1B2" }} />)
                                }
                                disableUnderline
                            >
                                <MenuItem value={1}>24H</MenuItem>
                                <MenuItem value={2}>1W</MenuItem>
                                <MenuItem value={3}>1M</MenuItem>
                            </Select>
                        </Box>
                    }
                </Box>
                {!isMobile && <Box style={{ paddingRight: 20 }}>
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
                        {"All"}
                    </Button>
                </Box>}
            </Box>
            <div id="chartdiv" style={{
                width: "100%", 
                height: 300, 
                display: Number(activeTab) >= 0 && Number(activeTab) <= 2 ? "block": "none"
        }}></div>
            <Stockchart style={{
                display: Number(activeTab) > 2 ? "block": "none"
            }} />
        </>
    )
}
export default DetailChart;
