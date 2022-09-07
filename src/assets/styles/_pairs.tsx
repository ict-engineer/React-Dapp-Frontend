import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        toTokenIcon: {
            "& img": {
                marginLeft: "-5px",
                marginRight: "10px"
            }
        },
        mainContainer: {
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            marginLeft: "234px",
            "@media only screen and (max-width: 1024px)": {
                marginLeft: 0,
                marginBottom: theme.spacing(2),
                paddingTop: "0px"
            }
        },
        tableTitle: {
            fontFamily: "Raleway"
        },
        poolTitle: {
            fontFamily: "Raleway"
        },
        selectRoot: {
            display: 'flex !important',
            alignItems: "center",
            padding: theme.spacing(0, 2),
            "&:focus": {
                backgroundColor: "transparent !important"
            }
        }
    })
);
export default useStyles;