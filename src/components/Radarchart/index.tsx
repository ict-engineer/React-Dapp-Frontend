import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ApexChart from 'react-apexcharts';
import CurrencyLogo from '../../components/CurrencyLogo';
import { unwrappedToken } from 'utils/wrappedCurrency';

/* Chart code */
// Themes begin

// Themes end
interface TopTokenProps {
    topTokens: []
}
const Radarchart = ({topTokens}: TopTokenProps) => {
    let labels:any = [];
    let series:any = [];
    let total_liquidity = 0;
    topTokens.map((row:any) => {
        labels.push(row.name)
        total_liquidity += Number(row.liquidity);
    })
    topTokens.map((row:any) => {
        series.push(Math.round(Number(row.liquidity)/total_liquidity*100) > 1 ? Math.round(Number(row.liquidity)/total_liquidity*100) : 0.5)
    })
    // let label_total = total_liquidity.toString()
    // label_total = label_total.slice(0, (label_total.length-10));
    let state:any = {
        series: series,
        options: {
            chart: {
                height: 400,
                type: 'radialBar',
            },
            fill: {
                colors: ['#627eea', "#2ba55d", "#f4b731", "#000000", "#00d395"]
            },
            plotOptions: {
                bar: {
                    borderRadius: 50
                },
                radialBar: {
                    startAngle: -180,
                    endAngle: 180,
                    hollow: {
                        margin: 5,
                        size: '20%',
                        background: 'transparent',
                        image: undefined,
                        imageWidth: 150,
                        imageHeight: 150,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        imageClipped: true,
                        position: 'front',
                        dropShadow: {
                          enabled: false,
                          top: 0,
                          left: 0,
                          blur: 10,
                          opacity: 0.5
                        }
                    },
                    track: {
                        show: true,
                        startAngle: undefined,
                        endAngle: undefined,
                        background: '#c2c2c2',
                        strokeWidth: '97%',
                        opacity: 1,
                        margin: 12, 
                        borderRadius: 15,
                        dropShadow: {
                            enabled: false,
                            top: 0,
                            left: 0,
                            blur: 3,
                            opacity: 0.5
                        }
                    },
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        colors: ['#ff0000', "#00ff00", "#0000ff", "#ff00ff"],
                        total: {
                            show: true,
                            label: '',
                            formatter: function () {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                // return label_total+"b"
                                return ""
                            }
                        }
                    }
                }
            },
            labels: labels,
        }
    };
    useEffect(() => {

    })
    return (
        <>
        <ApexChart options={state.options} series={state.series} colors={state.options.fill.colors} type="radialBar" height={330} />
        <Typography style={{color: "grey", textAlign: "center", fontFamily: "Raleway"}}>Trading Volume(24h)</Typography>
        <Box>
            {topTokens.map((row:any) => (
                <Box key={row.name} style={{ display: "flex", padding: "4px 24px", alignItems: "center"}}>
                    <CurrencyLogo
                        currency={unwrappedToken(row?.token)}
                    />
                    <Typography style={{ paddingLeft: "16px", fontFamily: "Raleway" }}>{row.name}</Typography>
                    <Box style={{ flexGrow: 1}}></Box>
                    <Typography style={{fontFamily: "Raleway"}}>$ {row.liquidity.toLocaleString()}</Typography>
                </Box>
             ))}
        </Box>
        </>
    )
}

export default Radarchart;


