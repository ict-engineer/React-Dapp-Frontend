import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        mainContainer: {
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            marginLeft: "234px",
            // [theme.breakpoints.up('xs')]: {
            //     marginLeft: "16px"
            // }
            "@media only screen and (max-width: 1024px)": {
                marginLeft: 0
            }
        },
        chartContainer: {
            boxShadow: "0px 4px 20px 5px rgb(0 0 0 / 8%)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: theme.spacing(2,3),
            height: "100%",
            overflow: "visible !important",
        },
        toTokenIcon: {
            "& img": {
                marginLeft: "-5px",
                marginRight: "10px"
            }
        },
        transactionGrid: {
            background: theme.palette.background.default
        },
        cellStyle: {
            fontWeight: "bolder"
        },
        tabList: {
            "& span": {
                fontSize: 14,
                fontWeight: 500,
            },
            "& button": {
                minWidth: "unset"
            },
            "& .MuiTabs-indicator": {
                height: 4,
                backgroundColor: theme.palette.secondary.light
            }
    
        },
        leftDivider: {
            boxShadow: "none",
            borderLeft: "1px solid #CECECE",
            borderRadius: 0
        },
        headerTitle: {
            display: "flex",
            fontSize: "16px",
            marginBottom: "28px",
            "@media only screen and (max-width: 1024px)": {
                display: "block",
                marginBottom: "16px"
            }
        }
    })
);
export default useStyles;