import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bgImage:{
            backgroundPosition: "center",
            backgroundSize: "cover",
            position: "absolute",
            height: 210,
            width: "100%",
            opacity: "0.7",
            [theme.breakpoints.down('xs')]: {
                height: 150
            }
        },
        mainContainer: {
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            paddingTop: "16px",
            position: "relative",
            // zIndex: 1000000,
            marginBottom: theme.spacing(4),
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1, 3)
            }
        },
        panelWrapper: {
            display: 'flex', 
            justifyContent: "center",
            [theme.breakpoints.down('xs')]: {
                flexDirection: "column-reverse"
            }
        },
        infoPanel: {
            padding: theme.spacing(3, 4),
            width: theme.spacing(80),
            // height: theme.spacing(67),
            background: theme.palette.background.paper,
            borderRadius: "24px",
            marginRight: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                margin: theme.spacing(0,0),
                paddingLeft: theme.spacing(3.5),
                paddingRight: theme.spacing(3.5)
            }
        },
        farmPanel: {
            padding: theme.spacing(4, 4.5),
            width: theme.spacing(52.5),
            background: theme.palette.background.paper,
            borderRadius: "24px",
            cursor: "pointer",
            boxShadow: "0px 4px 22px 5px rgba(0, 0, 0, 0.08)",
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                paddingLeft: theme.spacing(3.5),
                paddingRight: theme.spacing(3.5),
                marginBottom: theme.spacing(3)
            }
        },
        infoTitle: {
            fontSize: "14px", 
            fontWeight: 500,
            color: "#9DD1B2",
            paddingBottom: theme.spacing(2)
        },
        farmTitle: {
            fontSize: "14px", 
            fontWeight: 500, 
            fontFamily: "Raleway",
            padding: theme.spacing(0.5,0)
        },
        farmValue: {
            fontSize: "14px",
            fontWeight: 500,
            padding: theme.spacing(0.5,0)
        },
        modalContainer: {
            paddingLeft: theme.spacing(8.6),
            paddingRight: theme.spacing(8.6),
            paddingBottom: theme.spacing(6),
            maxWidth: "495px",
            maxHeight: "524px",
            textAlign: "center",
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
        modalToken: {
            fontSize: 24, 
            fontWeight: 500,
        },
        input: {
            "& input": {
                fontSize: 24,
                fontWeight: 500
            },
            "& fieldset": {
                border: "none"
            }
        },
        inputPanel: {
            padding: theme.spacing(0, 0),
            borderRadius: 16,
            background: "linear-gradient(180deg, rgba(157, 209, 178, 0.57) 0%, rgba(157, 209, 178, 0.19) 100%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)"
        },
        modalWrapper: {
            borderRadius: "24px",
            boxShadow: "0px 4px 20px 5px rgba(0, 0, 0, 0.08)", 
        },
        enabledButton: {
            color: "white", 
            fontSize: 16, 
            backgroundColor: "#2BA55D", 
            width: "49%", 
            height: 48, 
            marginTop: 16, 
            marginBottom: 30, 
            borderRadius: 8, 
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
        activedApprove: {
            color: "white", 
            fontSize: 16, 
            backgroundColor: "#2BA55D", 
            width: "100%", 
            height: 48, 
            marginTop: 16, 
            marginBottom: 30, 
            borderRadius: 8
        },
        deactivedApprove: {
            // color: "2BA55D", 
            fontSize: 16, 
            backgroundColor: theme.palette.background.default, 
            width: "100%", 
            height: 48, 
            marginTop: 16, 
            marginBottom: 30, 
            borderRadius: 8,
            border: "1px solid #2BA55D"
        },
        activedHarvest: {
            color: "white", 
            marginLeft: 20, 
            borderRadius: 8, 
            backgroundColor: "#2BA55D"
        },
        deactivedHarvest: {
            marginLeft: 20, 
            borderRadius: 8, 
            border: "1px solid #2BA55D"
        }
    })
);
export default useStyles;