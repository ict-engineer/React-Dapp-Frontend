import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tableTitle: {
        fontFamily: "Raleway"
    },
    pagination: {
        "& .MuiPaginationItem-outlinedPrimary.Mui-selected": {
            backgroundColor: (theme.palette as any).custom.background,
            border: (theme.palette as any).custom.border
        }
    },
    mainContainer: {
        backgroundImage: "linear-gradient(180deg, rgba(157, 209, 178, 0.26) 0%, rgba(157, 209, 178, 0) 100%)",
        paddingTop: 24,
        marginLeft: 234,
        "@media only screen and (max-width: 1024px)": {
            marginLeft: 0
        }
    },
    gridContainer: {
        display: "flex",
        flexDirection: "column",
        width: "calc(100% - 423px - 16px",
        marginRight: "16px",
        "@media only screen and (max-width: 1024px)": {
            marginLeft: 0
        }
    },
    topPairContainer: {
        marginLeft: 234,
        width: "unset",
        "@media only screen and (max-width: 1024px)": {
            marginLeft: 0,
            borderRadius: 0,
            border: "none",
            background: "transparent !important",
            "& .MuiTableContainer-root": {

                boxShadow: "none"
            }
        }
    },
    tableContainer: {
        borderRadius: 16,
        "@media only screen and (max-width: 1024px)": {
            "& .MuiTableContainer-root": {

                boxShadow: "none"
            }
        }
    },
    headerTitle: {
        display: "flex",
        alignItems: "baseline",
        padding: "16px 0px",
        "@media only screen and (max-width: 1024px)": {
            alignItems: "center",
            display: "flex",
        }
    },
    container: {
        [theme.breakpoints.down('xs')]: {
            margin: "0px !important"
        }
    }
}));
export default useStyles;