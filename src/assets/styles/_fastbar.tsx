import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        mainContainer: {
            display: "flex",
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            paddingTop: "16px",
            justifyContent: "center",
            [theme.breakpoints.down('xs')]: {
                // flexDirection: "colmun-reverse"
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
        chartPanel: {
            width: "calc(100% - 423px - 24px)",
            padding: theme.spacing(1),
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                heightmargin: theme.spacing(0,0),
                padding: theme.spacing(2)
            },
            marginRight: 24,
        },
        fastbarPanel: {
            padding: theme.spacing(4),
            width: "421px",
            boxShadow: "0px 4px 22px 5px rgba(0, 0, 0, 0.08)",
            borderRadius: "32px",
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                "& > div": {
                    width: "100%"
                },
                marginBottom: theme.spacing(3)
            }
        },
        infoTitle: {
            fontSize: "14px", 
            fontWeight: 500,
            color: "#9DD1B2",
            paddingBottom: theme.spacing(2)
        },
        topContainer: {
            marginTop: theme.spacing(5),
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            alignItems: "flex-end",
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(1),
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
        fastbarFont: {
            fontSize: 24, 
            fontWeight: 500,
            paddingLeft: 16
        },
        disabledButton: {
            // color: "#2BA55D", 
            fontSize: 16, 
            backgroundColor: theme.palette.background.default, 
            width: "49%", 
            height: 48, 
            marginTop: 16, 
            marginBottom: 30, 
            borderRadius: 8, 
            border: "1px solid #2BA55D"
        },
        activedButton: {
            color: "white", 
            fontSize: 16, 
            backgroundColor: "#2BA55D", 
            width: "49%", 
            height: 48, 
            marginTop: 16, 
            marginBottom: 30, 
            borderRadius: 8,
            "&:hover": {
                background: "#0d6330"
            },
        },
        modalContainer: {
            paddingLeft: theme.spacing(7.5),
            paddingRight: theme.spacing(7.5),
            paddingBottom: theme.spacing(6),
            maxWidth: "495px",
            maxHeight: "524px",
            textAlign: "center",
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
        input: {
            "& input": {
                fontSize: 48,
                fontWeight: 500,
                textAlign: "center"
            },
            "& fieldset": {
                border: "none"
            }
        },
        inputPanel: {
            padding: theme.spacing(0, 0),
            // borderRadius: 16,
            display: 'grid'
        },
        modalWrapper: {
            borderRadius: "24px",
            boxShadow: "0px 4px 20px 5px rgba(0, 0, 0, 0.08)", 
        },
        mainTitle: {
            fontSize: 34, 
            fontWeight: 300, 
            paddingBottom: 48,
            [theme.breakpoints.down('xs')]: {
                paddingBottom: 0
            }
        },
        maxStyle: {
            fontSize: 16, 
            fontWeight: 500, 
            color: "#2BA55D", 
            background: "transparent", 
            paddingBottom: 48, 
            paddingTop: 26,
            "&:hover": {
                background: "transparent",
            },
            [theme.breakpoints.down('xs')]: {
                paddingBottom: 0,
                paddingTop: 0
            }
        },
        approveStyle: {
            color: "white", 
            fontSize: 16, 
            backgroundColor: "#2BA55D", 
            width: "100%", 
            height: 79, 
            marginTop: 16, 
            marginBottom: 20, 
            borderRadius: 8,
            "&:hover": {
                background: "#0d6330"
            },
            [theme.breakpoints.down('xs')]: {
                paddingTop: 0,
                paddingBottom: 0
            }
        }
    })
);
export default useStyles;