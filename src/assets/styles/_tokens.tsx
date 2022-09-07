import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        mainContainer: {
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            marginLeft: "234px",
            "@media only screen and (max-width: 1024px)": {
                marginLeft: 0,
                marginBottom: theme.spacing(2)
            }
        },
    })
);
export default useStyles;