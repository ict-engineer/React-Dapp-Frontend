import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 96
    },
    spacing: {
        padding: theme.spacing(0, .5)
    },
    allowChipIcon: {
        color: "green"
    },
    blockChipIcon: {
        color: "crimson"
    },
    verifyChipIcon: {
        color: "green"
    },
    nonVerifyChipIcon: {
        color: "grey"
    },
    chipIcon: {
        fontSize: 17,
    },
    tools: {
        padding: 4
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 2
    },
    formControl: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 50,
        "& > div": {
            padding : theme.spacing(0, 0.5)
        }
    },
    footer: {
        display: "flex",
        justifyContent: "center",
        alignItems : "center",
        padding : theme.spacing(2, 5),
    },
    darkFooter: {
        "& .MuiPaginationItem-outlinedPrimary.Mui-selected": {
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.23)",
            backgroundColor: "rgba(255, 255, 255, 0.16)"
        }
    },
    workWrap: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    mainContainer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    tableTitle: {
        fontFamily: "Raleway"
    },
    gridStyle: {
        border: "none !important"
    },
    selectRoot: {
        display: 'flex !important',
        alignItems: "center",
        padding: theme.spacing(0, 2),
        "&:focus": {
            backgroundColor: "transparent !important"
        }
    },
    swapContainer: {
        [theme.breakpoints.down('xs')]: {
            width :"100%",
            padding: theme.spacing(3, 1),
            "& > div": {
                width: "100%",
            }
        }
    },
    container: {
        paddingTop: 24,
        marginLeft: 234,
        [theme.breakpoints.down('xs')]: {
            margin: "0px !important"
        }
    },
    tableContainer: {
        padding: 16,
        boxShadow: 'none',
    },
    gridWrapper: {
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column-reverse",
        }
    },
    boxWrapper: {
        [theme.breakpoints.down('xs')]: {
            width : "100% !important"
        }
    },
    infoWrapper: {
        alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column"
        },
        "& > div": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    }
}));
export default useStyles;