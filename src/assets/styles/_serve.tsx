import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        mainContainer: {
            // display: "flex",
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
        topContainer: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(7),
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            alignItems: "flex-end",
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(3.5),
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
            }
        },
        servePanel: {
            padding: theme.spacing(4),
            width: "645px",
            boxShadow: "0px 4px 22px 5px rgba(0, 0, 0, 0.08)",
            borderRadius: "32px",
            marginLeft: "auto",
            marginRight: "auto",
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
            paddingBottom: theme.spacing(1)
        },
        input: {
            width: "100%",
            "& input": {
                fontSize: 16,
                fontWeight: 400,
                fontFamily: "Raleway",
            },
            "& fieldset": {
                border: "none"
            }
        },
        buttonStyle: {
            color: "white", 
            fontSize: 16, 
            fontWeight: 500,
            backgroundColor: "#2BA55D", 
            width: "100%", 
            height: 64, 
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
        },
        serveWrapper: {
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(10),
            fontSize: 16, 
            fontWeight: 400, 
            fontFamily: "Raleway", 
            width: "645px",
            [theme.breakpoints.down('xs')]: {
                width: "auto",
                paddingTop: theme.spacing(5),
                paddingBottom: theme.spacing(12)
            }
        },
        inputPanel: {
            paddingBottom: theme.spacing(2),
            background: "linear-gradient(180deg, rgba(157, 209, 178, 0.57) 0%, rgba(157, 209, 178, 0.19) 100%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)", 
            borderRadius: 16,
        }
    })
);
export default useStyles;