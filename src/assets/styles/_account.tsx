import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        pageContainer: {
            background: "linear-gradient(180deg, rgba(157, 209, 178, 0.26) 0%, rgba(157, 209, 178, 0) 100%)",
        },
        mainContainer: {
            display: "flex",
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            paddingTop: "16px",
            [theme.breakpoints.down('xs')]: {
                flexDirection: "column",
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3),
                marginBottom: theme.spacing(4)
            }
        },
        pageTitle: {
            paddingLeft: theme.spacing(8),
            paddingTop: "16px",
            fontSize: 34, 
            fontWeight: 300,
            [theme.breakpoints.down('xs')]: {
                fontSize: 32,
                paddingLeft: theme.spacing(4),
            }
        },
        mainTitle: {
            fontSize: 14, 
            fontWeight: 500,
            paddingBottom: 8,
            color: "#9DD1B2"
        },
        valueFont: {
            fontSize: 48,
            fontWeight: 500,
            paddingBottom: 48,
            [theme.breakpoints.down('xs')]: {
                fontSize: 36
            }
        },
        xfastValue:{
            fontSize: 24, 
            fontWeight: 500,
            [theme.breakpoints.down('xs')]: {
                fontSize: 20
            }
        },
        tablePanel: {
            width: "calc(100% - 423px - 24px)",
            padding: theme.spacing(1),
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                heightmargin: theme.spacing(0,0),
                padding: theme.spacing(2)
            },
            marginRight: 24,
        },
        tableContainer: {
            boxShadow: "none",
            backgroundColor: "transparent",
            borderRadius: 8,
            "& th": {
                paddingLeft: 0
            },
            "& td": {
                paddingLeft: 0
            }
        },
        tableTitle: {
            fontFamily: "Raleway"
        },
        poolTitle: {
            fontFamily: "Raleway"
        },
        primaryTransTitle: {
            fontSize: 20, 
            fontWeight: 500
        },
        secondTransTitle: {
            fontSize: 12,
            fontWeight: 400, 
            fontFamily: "Raleway"
        },
        transactionPanel: {
            padding: theme.spacing(1),
            width: "48%",
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                "& > div": {
                    width: "100%"
                }
            }
        },
        listWrapper: {
            borderRadius: 8,
            margin: theme.spacing(0.5, 0),
            backgroundColor: theme.palette.background.paper
        },
        tableValue: {
            fontSize: 14, 
            fontWeight: 500
        },
        modalWrapper: {
            borderRadius: "24px",
            boxShadow: "0px 4px 20px 5px rgba(0, 0, 0, 0.08)", 
        },
        modalContainer: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            paddingBottom: theme.spacing(6),
            maxWidth: "495px",
            width: "400px",
            maxHeight: "524px",
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
    })
);
export default useStyles;