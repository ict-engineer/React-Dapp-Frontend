import React from "react";
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MobileFooter from '../MobileFooter';

import twitter_grey from "../../assets/images/landing/twitter_grey.svg";
import telegram_grey from "../../assets/images/landing/telegram_grey.svg";

import useStyles from "../../assets/styles";

const Footer = () => {
    const classes = useStyles.footer();
    const openTwitter = () => {
        window.open("https://twitter.com/fastswapdex")
    }
    const openTelegram = () => {
        window.open("https://t.me/fastswapdex")
    }
    const isMobile = useMediaQuery('(max-width: 1024px)');
    return (
        <>
        {isMobile ? 
            <MobileFooter /> : 
            <Grid container className={classes.footerConatiner}>
                <Typography component="div" className={classes.footerText}>Terms of Service</Typography>
                <Box style={{ display: "flex", alignItems: "center" }}>
                    <Typography className={classes.footerText}>FASTSWAP  All rights reserved</Typography>
                    <IconButton 
                        style={{ padding: "0px 8px" }}
                        onClick={() => openTwitter()}
                    >
                        <img alt="icon" src={twitter_grey} />
                    </IconButton>
                    <IconButton 
                        style={{ padding: "0px 8px" }}
                        onClick={() => openTelegram()}
                    >
                        <img alt="icon" src={telegram_grey} />
                    </IconButton>
                </Box>
            </Grid>
            }
        </>
    )
}

export default Footer;