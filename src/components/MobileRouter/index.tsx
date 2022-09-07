import React from 'react'
import Select from '@material-ui/core/Select';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useHistory } from 'react-router';
import Box from "@material-ui/core/Box";
import union from "../../assets/images/union.svg";
import global from "../../assets/images/global.svg";
import album from "../../assets/images/album.svg";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const MobileRouter = ({ classes } : any) => {
    const History = useHistory()
    const [selection, setSelectValue] = React.useState<number>(1);

    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectValue(event.target.value as number);
        if(event.target.value === 1){
            gotoPage('overview')
        }else if(event.target.value === 2){
            gotoPage('tokens')
        }else if(event.target.value === 3){
            gotoPage('pairs')
        }
    };
    const gotoPage = (page:any) => {
        sessionStorage.setItem("activeDrawer", page)
        History.push(`/${page}`);
    };
    React.useEffect(() => {
        const activeRoute = sessionStorage.getItem("activeDrawer");
        let activeDrawer = 1;
        if(activeRoute === 'overview')
            activeDrawer = 1;
        else if(activeRoute === 'tokens')
            activeDrawer = 2;
        else if(activeRoute === 'pairs')
            activeDrawer = 3;
       
        
        if(activeRoute)
            setSelectValue(activeDrawer);
        else    
            setSelectValue(1);
    }, [])

    return (
        <Box>
            <Select
                value={selection}
                onChange={handleChangeSelect}
                IconComponent={
                    () => (<KeyboardArrowDownIcon />)
                }
                style={{width: "100%", paddingLeft: "16px", paddingRight: "16px"}}
                classes={{
                    root: classes.selectRoot
                }}
                disableUnderline
                MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                    }
                }}
            >
                    <MenuItem style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} value={1}>
                        {<img alt="overview" src={global} />} 
                        <Typography style={{ fontSize: "20px", fontWeight: 500, padding: "0px 16px" }}>Overview</Typography>
                    </MenuItem>
                    <MenuItem style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} value={2}>
                        {<img alt="overview" src={union} />} 
                        <Typography style={{ fontSize: "20px", fontWeight: 500, padding: "0px 16px" }}>Tokens</Typography>
                    </MenuItem>
                    <MenuItem style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} value={3}>
                        {<img alt="overview" src={album} />} 
                        <Typography style={{ fontSize: "20px", fontWeight: 500, padding: "0px 16px" }}>Pairs</Typography>
                    </MenuItem>
            </Select>
        </Box>
            
    )
}
export default MobileRouter