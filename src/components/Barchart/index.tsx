import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

am4core.useTheme(am4themes_animated);
interface volumeProps {
    volume: string
}
const Barchart = ({volume}:volumeProps) => {
    const [chartdata, setChartData] = useState([]);
    function getChartData(currency:any, duration:any, cb:any){
        try {
            axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0xc888a0ab4831a29e6ca432babf52e353d23db3c2/market_chart/?vs_currency=${currency}&days=${duration}`)
            .then(response => {
                cb(response.data.total_volumes);
            })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }
    function generateChartData(chartdata:any) {
        let chartData = [];
        // current date
        let old_hour = 0;
        for (var i = 0; i < chartdata.length; i++) {
            if(chartdata[i]){
                let newDate = new Date(chartdata[i][0]);
                let hour = newDate.getHours();
                
                // each time we add one minute
                // newDate.setMinutes(newDate.getMinutes() + i);
                // some random number
                let volume = chartdata[i][1];
                // let percent = Math.round(currencyA[i][1]/10);
                // add data item to the array\
                if(hour !== old_hour && hour > old_hour){
                    chartData.push({
                        hour: hour.toString(),
                        volume: volume
                    });
                    if(chartData.length === 23){
                        break;
                    }
                }
                old_hour = hour;
            }
        }
        const compare = (a:any, b:any) => {
            const hourA = Number(a.hour);
            const hourB = Number(b.hour);
            let comparison = 0;
            if(hourA > hourB){
                comparison = 1;
            } else if (hourA < hourB) {
                comparison = -1;
            }
            return comparison;
        }
        chartData = chartData.sort(compare);
        return chartData;
        
    }

    useEffect(() => {
        let chart = am4core.create("barchartdiv", am4charts.XYChart);
        chart.paddingRight = 20;

        chart.data = generateChartData(chartdata.sort());
        chart.dateFormatter.inputDateFormat = "HH";
        let gradient = new am4core.LinearGradient();
        gradient.addColor(am4core.color("#65d7a7"));
        gradient.addColor(am4core.color("#65d7a7"));

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.grid.template.disabled = true;
        dateAxis.baseInterval = {timeUnit:"hour", count:1};

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.tooltip.disabled = true;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;

        let series = chart.series.push(new am4charts.StepLineSeries());
        series.dataFields.dateX = "hour";
        series.dataFields.valueY = "volume";
        series.tooltipText = "{valueY.volume}";
        series.strokeWidth = 0;
        series.fillOpacity = 0.8;
        series.fill = gradient;
        series.stroke = am4core.color("#65d7a7")

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.fullWidthLineX = true;
        chart.cursor.lineX.strokeWidth = 0;
        chart.cursor.lineX.fill = chart.colors.getIndex(1);
        chart.cursor.lineX.fillOpacity = 0.1;

    }, [chartdata])
    useEffect(() => {
        getChartData('usd', 1, (data:any) => {
            setChartData(data);
        });
    }, [])
    return (
        <Box>
            <Typography style={{fontSize: "14px", fontWeight: 500, color: "#9DD1B2"}}>Trading Volume(24H)</Typography>
            <Typography style={{fontSize: "48px", fontWeight: 500}}>${volume ? parseInt(volume).toLocaleString() : ''}</Typography>
            <div id="barchartdiv" style={{ width: "100%", height: 300 }}></div>
        </Box>
        
    )
}
export default Barchart;