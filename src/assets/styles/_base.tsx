import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 235;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: "column"
    },
    content: {
        flexGrow: 1,
        paddingTop: 96,
        paddingBottom: 48 + 24,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    mainContainer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));
export default useStyles;