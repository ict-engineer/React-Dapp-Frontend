import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footerText: {
            margin: "unset",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        footerConatiner: {
            position: "fixed",
            borderTop: "1px solid #757B75",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            bottom: 0,
            height: "48px",
            background: theme.palette.background.default,
            zIndex: 9000000,
            padding: theme.spacing(0, 8),
            marginBottom: 0
        },
        mobilefooter: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: `${theme.spacing(8)}px !important`,
            zIndex: 90000000,
            background: `${(theme.palette as any).custom.mobile.bottomNavigationBackground} !important`,
            "& span": {
                fontSize: 10,
                // color: (theme.palette as any).custom.mobilenav
                color: 'white'
            },
            "& button": {
                minWidth: "unset",
                "&.Mui-selected": {
                    borderBottom: "4px solid #EBF8F0"
                }
            },
            // "& .MuiTabs-indicator": {
            //     height: 4,
            //     backgroundColor: theme.palette.secondary.light
            // }
        },
    })
);
export default useStyles;