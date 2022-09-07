import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tableTitle: {
        fontFamily: "Raleway"
    },
    gridStyle: {
        border: "none !important"
    },
    mainContainer: {
        backgroundImage: "linear-gradient(180deg, rgba(157, 209, 178, 0.26) 0%, rgba(157, 209, 178, 0) 100%)",
        paddingTop: 24,
        marginLeft: 234,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
        }
    },
    pooledTitle: {
        fontSize: 20, 
        fontWeight: 500,
        color: "@131413",
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
            paddingBottom: 8
        }
    },
    pooledPanel: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        [theme.breakpoints.down('xs')]: {
            display: "block",
        }
    },
    token1Value: {
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(1)
        }
    },
    infoWrapper: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(2, 0),
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
            justifyContent: "flex-start", 
            alignItems: "baseline"
        },
        // "& > div": {
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        // }
    }
}));
export default useStyles;