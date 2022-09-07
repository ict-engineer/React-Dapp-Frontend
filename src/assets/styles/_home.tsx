import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        chartContainer: {
            boxShadow: "0px 4px 20px 5px rgb(0 0 0 / 8%)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px 24px",
            height: "100%",
            width: "auto"
        },
        toTokenIcon: {
            "& img": {
                marginLeft: "-5px",
                marginRight: "10px"
            }
        },
        mainContainer: {
            display: "flex",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            marginLeft: "234px",
        },
        chartPanel: {
            width: "calc(100% - 423px - 24px)",
            marginRight: 24
        }
    })
);
export default useStyles;