import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        landingContainer: {
            marginTop: theme.spacing(15),
            paddingLeft: theme.spacing(12),
            "@media only screen and (max-width: 1024px)": {
                margin: theme.spacing(6, 0),
                width: "100%",
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4)
            }
        },
        swapPanel: {
            paddingRight: theme.spacing(10),
        },
        toolbar: {
            alignItems: "center",
            height: theme.spacing(12),
            marginLeft: theme.spacing(6),
            "@media only screen and (max-width: 1024px)": {
                marginLeft: theme.spacing(2.2),
                height: 72,
                marginRight: theme.spacing(1)
            }
        },
        logo: {
            "@media only screen and (max-width: 1024px)": {
                width: "100%",
                height: "100%",
                paddingRight: "12px",
                objectFit: "contain"
            }
        },
        headerLogo: {
            "@media only screen and (max-width: 1024px)": {
                width: "156.33px",
                height: "56px",

            }
        },
        spacing: {
            padding: theme.spacing(0, .5),
            flexGrow : 1
        },
        launchappButton: {
            marginRight: theme.spacing(6),
            marginLeft: theme.spacing(3),
            padding: theme.spacing(2, 6),
            backgroundColor: "#2BA55D",
            borderRadius: 26,
            width: 188,
            height: 48,
            "& span": {
                fontSize: 16,
                color: "#FFFFFF"
            },
            "&:hover": {
                background: "#0d6330"
            },
            "@media only screen and (max-width: 1024px)": {
                width: "100%",
                marginTop: theme.spacing(6.5),
                marginRight: theme.spacing(0),
                marginBottom: theme.spacing(10.5),
                marginLeft: 0
            }
        },
        animlaunchappButton: {
            marginRight: theme.spacing(6),
            padding: theme.spacing(2, 6),
            backgroundColor: "#2BA55D",
            borderRadius: 26,
            width: 257,
            height: 48,
            "& span": {
                fontSize: 16,
                color: "#FFFFFF"
            },
            "&:hover": {
                background: "#0d6330"
            },
            "@media only screen and (max-width: 1024px)": {
                width: "100%",
                marginTop: theme.spacing(6.5),
                marginRight: theme.spacing(0),
                marginBottom: theme.spacing(10.5),
            }
        },
        title: {
            fontWeight: "bolder",
            fontSize: 48,
            marginBottom: theme.spacing(2.5),
            marginTop: theme.spacing(3.5),
            color: "#131413",
            "@media only screen and (max-width: 1024px)": {
                fontSize: 36,
            }
        },
        subTitle: {
            fontWeight: 400,
            fontSize: 16,
            color: "#131413",
            fontFamily: "Raleway"
        },
        animTitle: {
            fontWeight: "bolder",
            fontSize: 48,
            marginBottom: theme.spacing(2),
            color: "#131413",
            "@media only screen and (max-width: 1024px)": {
                marginBottom: theme.spacing(5),
                fontSize: 36
            }
        },
        animSubtitle: {
            fontWeight: 300,
            fontSize: 34,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(4.5),
            color: "#131413",
            "@media only screen and (max-width: 1024px)": {
                marginBottom: theme.spacing(5),
                marginTop: 0,
                fontSize: 32
            }
        },
        numberGroup: {
            borderBottom: "4px solid #9DD1B2", 
            width: "calc(100% - 16px)", 
            marginRight: 16, 
            padding: "8px 0px",
            paddingTop: theme.spacing(12),
            color: "#131413",
            fontFamily: "Raleway",
            "@media only screen and (max-width: 1024px)": {
                paddingTop: theme.spacing(6.5),
                height: "100%",
            }
        },
        numberBox: {
            fontSize: 24, 
            fontWeight: "bolder",
            fontFamily: "Oswald"
        },
        footerGrid: {
            borderTop: "2px solid #000", 
            marginTop: theme.spacing(42.5),
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
            marginBottom: theme.spacing(1),
            width: "calc(100% - 64px) !important",
            justifyContent: "space-between",
            paddingTop: theme.spacing(2),
            "@media only screen and (max-width: 1024px)": {
                margin: theme.spacing(9.5, 0),
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(2.5),
                width: "100% !important",
                paddingTop: theme.spacing(4),
            }
        },
        TextButton: {
            fontWeight: "bolder",
            fontSize: "16px",
            color: "#131413",
            paddingLeft: 0,
            marginTop: theme.spacing(1),
            background: "transparent",
            "&:hover":{
                background: "transparent"
            },
            "&:focus":{
                background: "transparent"
            }
        },
        productBy: {
            fontSize: "10px",
            fontWeight: 500,
            textAlign: "center",
            paddingBottom: theme.spacing(3),
            color: "#131413",
            fontFamily: "Raleway",
            "@media only screen and (max-width: 1024px)": {
                paddingBottom: theme.spacing(11.5)
            }
        },
        animateImage: {
            "@media only screen and (max-width: 1024px)": {
                padding: theme.spacing(2.5),
            }
        },
        animateImg: {
            "@media only screen and (max-width: 1024px)": {
                width: "100%"
            }
        },
        slideScreen: {
            "@media only screen and (max-width: 1024px)": {
                height: "100%",
                background: "#2BA55D",
                textAlign: "center",
                overflow: "hidden"
            }
        },
        slideImg: {
            "@media only screen and (max-width: 1024px)": {
                height: "100%",
                width: "100%",
                objectFit: "cover",
                overFlow: "hidden"
            }
        },
        slideBg: {
            "@media only screen and (max-width: 1024px)": {
                height: "40%",
                width: "100%",
                transform: "scale(1.2)",
                transfromOrigin: "top",
                marginTop: "15px"
            }
        },
        SlideButton: {
            "@media only screen and (max-width: 1024px)": {
                background: "transparent",
                fontWeight: "bolder",
                fontSize: "36px",
                paddingBottom: theme.spacing(4),
                color: "#FFFFFF"
            },
        },
        SocialBtnGroup: {
            "@media only screen and (max-width: 1024px)": {
                paddingTop: theme.spacing(6.5),
            }
        },
        landing: {
            backgroundColor: "#F8F8F8"
        }
    }
));
export default useStyles;