import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainContainer: {
            paddingLeft: theme.spacing(8),
            paddingRight: theme.spacing(8),
            paddingTop: "16px",
            backgroundImage: "url(../images/bg_farmdetail.png)",
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1, 3)
            }
        },
        topContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(5),
            alignItems: "flex-end",
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(1)
            }
        },
        tableContainer: {
            boxShadow: "none",
            borderRadius: 8,
            marginTop: theme.spacing(3.5),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        },
        pairToken: {
            color: "#2BA55D"
        },
        tokenPanel: {
            textAlign: 'center', 
            border: '1px solid #CECECE', 
            padding: "24px 0px", 
            borderRadius: "16px",
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down('xs')]: { 
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: "inherit",
                padding: theme.spacing(2,2)
            }
        },
        switcherActive: {
            padding: "0px 0px",
            backgroundColor: (theme.palette as any).custom.switcher,
            height: "32px"
        },
        switcher: {
            padding: "0px 0px",
            height: "32px"
        },
        tokenStyle: {
            borderRadius: "50px",
            border: "1px solid #d4d4d4",
            
        }
    })
);
export default useStyles;