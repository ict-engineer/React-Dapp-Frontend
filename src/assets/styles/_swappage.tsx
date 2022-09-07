import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        chartContainer: {
            boxShadow: "0px 4px 20px 5px rgb(0 0 0 / 8%)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px 24px",
            height: "100%",
            width: "auto",
            overflow: "visible !important",
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(0,2),
                boxShadow: "none",
                border: "none"
            }
        },
        toTokenIcon: {
            "& img": {
                marginLeft: "-5px",
                marginRight: "10px"
            }
        },
        mainContainer: {
            display: "flex",
            paddingLeft: "32px",
            paddingRight: "32px",
            paddingTop: "16px",
            "@media only screen and (max-width: 1024px)": {
                padding: theme.spacing(3, 0)
            }
        },
        chartPanel: {
            width: "calc(100% - 423px - 24px)",
            marginRight: 24,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                margin: theme.spacing(0,0),
                padding: theme.spacing(2)
            }

        },
        tableTitle: {
            fontFamily: "Raleway"
        },
        swapContainer: {
            padding: 16,
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                "& > div": {
                    width: "100%"
                }
            }
        }
    })
);
export default useStyles;