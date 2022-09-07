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
            display: "flex",
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            paddingTop: "16px",
            [theme.breakpoints.down('xs')]: {
                flexDirection: "column-reverse",
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3)
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
        tableTitle: {
            fontFamily: "Raleway"
        },
        poolTitle: {
            fontFamily: "Raleway"
        },
        PoolBox: {
            position: "relative",
            maxWidth: 420,
            width: "100%",
            background: theme.palette.background.paper,
            boxShadow: "0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%), 0px 24px 32px rgb(0 0 0 / 1%)",
            borderRadius: 16,
            padding: "1rem"
        },
        BoxWrapper: {
            display: 'flex', 
            justifyContent: 'flex-end', 
            paddingRight: theme.spacing(8),
            paddingTop: 32,
            [theme.breakpoints.down('xs')]: {
                display: 'block', 
                paddingLeft: theme.spacing(3),
                paddingRight: theme.spacing(3),
                marginBottom: theme.spacing(3)
            },
        },
        poolPanel: {
            padding: theme.spacing(1),
            width: "423px",
            [theme.breakpoints.down('xs')]: {
                width: "100%", 
                "& > div": {
                    width: "100%"
                }
            }
        }
    })
);
export default useStyles;