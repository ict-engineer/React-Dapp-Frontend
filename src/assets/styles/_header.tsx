import { fade, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
const drawerWidth = 235;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            height: theme.spacing(12),
            left: 0,
            position: "fixed",
            background: theme.palette.secondary.main,
            boxShadow: "0px 2px 10px -8px rgba(0,0,0,0.2), 0px 1px 10px -8px rgba(0,0,0,0.14), 0px 1px 10px -8px rgba(0,0,0,0.12)",
            zIndex: 1500,
            "@media only screen and (max-width: 1024px)": {
                boxShadow: "none",
                zIndex: 90000000
            }
        },
        appBarShift: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,   
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        button: {
            fontSize: 16,
            color: "#FFFFFF",
            padding: theme.spacing(2, 5),
            borderRadius: theme.spacing(1),
            margin: theme.spacing(0, 2)
        },
        fastButton: {
            color: "#2BA55D",
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            background: (theme.palette as any)?.custom.fast,
            height: 48,
            padding: theme.spacing(2, 2)
        },
        connectWalletButton: {
            fontSize: 16,
            color: "#FFFFFF",
            backgroundColor: theme.palette.secondary.dark + " !important",
            height: 48,
            padding: theme.spacing(2, 4.5)
        },
        tabList: {
            "& span": {
                fontSize: 16,
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
        avatar : {
            width: theme.spacing(6),
            height: theme.spacing(6),
            margin: theme.spacing(0, 1),
            borderRadius: 5,
            marginRight: 0
        },
        hide: {
            display: 'none',
        },
        toolbar: {
            height: "100%",
            paddingLeft: theme.spacing(8.5),
            paddingRight: theme.spacing(8.5),
            "@media only screen and (max-width: 1024px)": {
                paddingLeft:theme.spacing(3),
                paddingRight: theme.spacing(3.5),
                border: "none"
            }
        },
        toolbarNested: {
            minHeight: 50,
            color: "#222"
        },
        breadcrumbs: {
            paddingLeft: theme.spacing(3),
            "& a":{
                display: "flex",
                alignItems: "center",
                textDecoration: "none !important"
            }
        },
        breakCrumbsSeperate: {
            fontSize: 4
        },
        drawerPaper: {
            width: drawerWidth,
            marginTop: 96,
            background: theme.palette.background.default,
            zIndex: 100
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            paddingLeft: theme.spacing(2),
            color: "white",
            // necessary for content to be below app bar
            ...theme.mixins.toolbar
        },
        clockParent: {
            justifyContent: "center"
        },
        spacing: {
            flexGrow : 1
        },
        userInfo: {
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft : theme.spacing(2),
        },
        hideMenuIcon: {
            color: "#6c7293",
            transform: "rotate(180deg)",
            transition: theme.transitions.create("color", {
                easing: theme.transitions.easing.easeOut,
                duration: "0.5s",
            }),
            "&:hover":{
                color: "#3597fc"
            }
        },
        list: {
            height: "100%",
            padding: "24px 0px"
        },
        listItem: {
            padding: theme.spacing(0, 3),
            margin: theme.spacing(2, 0),
            // "&:hover": {
            //     color: "#000000"
            // }
        },
        listItemIcon: {
            color: '#494b74',
            minWidth: 45
        },
        listItemText: {
            color: theme.palette.primary.contrastText,
            "& span": {
                opacity: 0.7,
                fontSize: 20
            }
        },
        listItemDivider: {
            padding: theme.spacing(1, 3),
            color: "#a2a3b7",
            opacity: .4,
            marginTop: theme.spacing(2)
        },
        listItemIconNested: {
            minWidth: 35,
            "& circle":{
                r : 3
            }
        },
        nestedList: {
            paddingLeft: theme.spacing(5.5)
        },
        active: {
            "& svg": {
                opacity: 1
            },
            "& span":{
                opacity: 1,
                fontWeight: "bolder",
            },
            borderRight: "8px solid #2BA55D",
            opacity: 1
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.black, 0.05),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.black, 0.08),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
        dropMenu: {
            boxShadow: "0px 4px 20px 5px rgba(0, 0, 0, 0.08)",
            borderRadius: 24,
            width: "330px",
            zIndex: 200000
        },
        primaryText: {
            fontSize: 24,
            fontWeight: 500,
            color: (theme.palette as any).primary.contrastText,
            "&:hover": {
                color: "#2BA55D"
            }
        },
        mobilePrimaryText: {
            fontSize: 24,
            fontWeight: 500,
            color: (theme.palette as any).custom.mobile.drawerColor
        },
        secondaryText: {
            fontSize: 16
        },
        divider: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2)
        },
        comingsoon: {
            backgroundColor: "#2BA55D",
            "& span": {
                color: "white"
            }
        },
        popover: {
            borderRadius: 20,
        },
        slideScreen: {
            "@media only screen and (max-width: 512px)": {
                height: "100%",
                background: "#2BA55D",
                textAlign: "center",
                overflow: "hidden"
            }
        },
        slideImg: {
            "@media only screen and (max-width: 512px)": {
                height: "100%",
                width: "100%",
                objectFit: "cover",
                overFlow: "hidden"
            }
        },
        slideBg: {
            "@media only screen and (max-width: 512px)": {
                height: "40%",
                width: "100%",
                transform: "scale(1.2)",
                transfromOrigin: "top",
                marginTop: "15px"
            }
        },
        SlideButton: {
            "@media only screen and (max-width: 512px)": {
                background: "transparent",
                fontWeight: "bolder",
                fontSize: "36px",
                paddingBottom: theme.spacing(4),
                color: "#FFFFFF"
            },
        },
        SocialBtnGroup: {
            "@media only screen and (max-width: 512px)": {
                paddingTop: theme.spacing(6.5)
            }
        },
        landingButton: {
            "&:hover": {
                background: "transparent"
            },
            "&:focus": {
                background: "transparent"
            }
        }
    })
);

export default useStyles;