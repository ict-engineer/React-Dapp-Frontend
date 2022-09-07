import React, {useState} from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid"
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import twitter from "../../assets/images/landing/twitter.png";
import telegram from "../../assets/images/landing/telegram.png";
import twitter_hover from "../../assets/images/landing/twitter_hover.svg";
import telegram_hover from "../../assets/images/landing/telegram_hover.svg";
import animation from "../../assets/images/landing/animation.svg";
import slide_bg from "../../assets/images/landing/slide_bg.svg";
import twitter_white from "../../assets/images/landing/twitter_white.svg";
import telegram_white from "../../assets/images/landing/telegram_white.svg";
import menu_icon from "../../assets/images/landing/menu_icon.svg";
import background_color from "../../assets/images/landing/background.svg";
import logo_white from "../../assets/images/landing/logo_white.png";
import { TransitionProps } from '@material-ui/core/transitions';
import useStyles from "../../assets/styles";
import { useHistory } from 'react-router';

import Swap from "../Swap";

// import { History } from "../theme";

// const Transition = React.forwardRef(function Transition(props:any, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });
const Transition = React.forwardRef<unknown, TransitionProps>((props:any, ref) => <Slide direction="up" ref={ref} {...props} />);

interface hoverState {
    icon: string,
    state: boolean
}
const Landing = () => {
    const classes = useStyles.landing();
    const baseClasses = useStyles.base();
    const History = useHistory();

    const isMobile = useMediaQuery('(max-width: 1024px)');

    const [open, setOpen] = useState(false);
    const [ishover, setIsHover] = useState<hoverState>({
        icon: '',
        state: false
    });
    
    const handleClickSlide = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const gotoPage = (page:any) => {
        History.push(`/${page}`);
    };
    const openTwitter = () => {
        window.open("https://twitter.com/fastswapdex")
    }
    const openTelegram = () => {
        window.open("https://t.me/fastswapdex")
    }
  
    return(
        <Box className={classes.landing}>
            <Box className={baseClasses.root} style={{backgroundImage: `url(${background_color})`, display: "cover"}}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerLogo}>
                        <img src={logo_white} alt="logo" className={classes.logo} />
                    </div>
                    <Box className={classes.spacing} />
                    {isMobile && <IconButton onClick={handleClickSlide}><img alt="icon" src={menu_icon} /></IconButton>}
                    {!isMobile && <Box>
                        <IconButton 
                            onMouseEnter={() => setIsHover({icon: "twitter", state: true})}
                            onMouseLeave={() => setIsHover({icon: "twitter", state: false})}
                            onClick={() => openTwitter()}
                        >
                            {ishover.icon === "twitter" && ishover.state ? <img alt="icon" src={twitter_hover} /> : <img alt="icon" src={twitter} />}
                        </IconButton>
                        <IconButton
                            onMouseEnter={() => setIsHover({icon: "telegram", state: true})}
                            onMouseLeave={() => setIsHover({icon: "telegram", state: false})}
                            onClick={() => openTelegram()}
                        >
                        {ishover.icon === "telegram" && ishover.state ? <img alt="icon" src={telegram_hover} /> : <img alt="icon" src={telegram} />}
                        </IconButton>
                        <Button 
                            // className={clsx(classes.button, classes.launchappButton)}
                            className={classes.launchappButton}
                            onClick={() => gotoPage('swap')}
                        >
                            LAUNCH APP
                        </Button>
                    </Box>}
                </Toolbar>
                <Container className={classes.landingContainer}>
                    {!isMobile ?
                    <Grid container spacing={2}>
                        <Grid item xs={7}> 
                            <Box className={classes.title}>FASTEST Swapping Experience</Box>
                            <Box className={classes.subTitle}>FastSwap is a decentralized protocol for automated liquidity provision on Ethereum</Box>
                            <Box className={classes.subTitle}>and Binance Smart Chain with Cross-Chain Swap through Parachain on Polkadot.</Box>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Trading Volume 23 hours</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Total Liquidity locked</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Total Value locked</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Box className={classes.swapPanel}>
                                <Swap />
                            </Box>
                        </Grid>
                    </Grid> :
                    <Grid container>
                        <Grid item xs={12}> 
                            <Box className={classes.title}>FASTEST Swapping Experience</Box>
                            <Box className={classes.subTitle}>FastSwap is a decentralized protocol for automated liquidity provision on Ethereum</Box>
                            <Box className={classes.subTitle}>and Binance Smart Chain with Cross-Chain Swap through Parachain on Polkadot.</Box>
                            <Grid container style={{paddingBottom: "50px"}}>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Trading Volume 23 hours</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Total Liquidity locked</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className={classes.numberGroup}>
                                        <Box className={classes.numberBox}>$2269K+</Box>
                                        <Box>Total Value locked</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <Button className={clsx(classes.button, classes.launchappButton)}> */}
                        <Button 
                            className={classes.launchappButton}
                            onClick={() => gotoPage('swap')}
                        >
                            LAUNCH APP
                        </Button>
                    </Grid>}
                    <Box className={classes.animateImage}>
                        <img src={animation} alt="animation" className={classes.animateImg} />
                    </Box>
                    <Grid container spacing={2} style={{marginTop: -100}}>
                        <Grid item xs={false} sm={2}></Grid>
                        <Grid item xs={12} sm={10}>
                            <Box>
                                <Box className={classes.animTitle}>Best Rates with Automatic Liquidity Aggregator</Box>
                                <Box className={classes.animTitle}>Excellent Rewards for Liquidity Providers</Box>
                                <Box className={classes.animSubtitle}>Split your trades & get the best price with one trade</Box>
                            </Box>
                            {!isMobile && 
                                <Button 
                                    className={classes.animlaunchappButton}
                                    onClick={() => gotoPage('swap')}
                                >
                                LAUNCH APP
                                </Button>
                            }
                        </Grid>
                    </Grid>
                </Container>
                <Grid container className={classes.footerGrid}>
                    <Grid item xs={6}>
                        {/* <Button className={classes.TextButton} onClick={() => gotoPage('home')}>LAUNCH APP</Button> */}
                        {/* <Button className={classes.TextButton} onClick={() => gotoPage('home')}>ABOUT US</Button> */}
                        <Box>
                            <img src={logo_white} alt="logo" className={classes.logo} />
                        </Box>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: "right"}}>
                        {/* <Box>
                        <img alt="icon" src={logo_white} alt="logo" className={classes.logo} />
                        </Box> */}
                        <Box style={{display: "flex", justifyContent: "flex-end"}}>
                            <IconButton
                                onMouseEnter={() => setIsHover({icon: "f_twitter", state: true})}
                                onMouseLeave={() => setIsHover({icon: "f_twitter", state: false})}
                                onClick={() => openTwitter()}
                            >
                                {ishover.icon === "f_twitter" && ishover.state ? <img alt="icon" src={twitter_hover} /> : <img alt="icon" src={twitter} />}
                            </IconButton>
                            <IconButton
                                onMouseEnter={() => setIsHover({icon: "f_telegram", state: true})}
                                onMouseLeave={() => setIsHover({icon: "f_telegram", state: false})}
                                onClick={() => openTelegram()}
                            >
                                {ishover.icon === "f_telegram" && ishover.state ? <img alt="icon" src={telegram_hover} /> : <img alt="icon" src={telegram} />}
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box className={classes.productBy}>@2021 FASTSWAP.ALL RIGHT RESERVED</Box>
                {isMobile && <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <Box className={classes.slideScreen}>
                        <Toolbar>
                            <Box className={classes.spacing} />
                            <IconButton onClick={handleClose} aria-label="close" style={{color: "white"}}>
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                        <Box className={classes.slideBg}>
                            <img src={slide_bg} alt="slide_bg" className={classes.slideImg} />
                        </Box>
                        <Box className={classes.SlideButton} onClick={() => gotoPage('swap')}>Launch app</Box>
                        {/* <Box className={classes.SlideButton}>About us</Box> */}
                        <Box className={classes.SocialBtnGroup}>
                            <IconButton
                                onClick={() => openTwitter()}
                            >
                                <img alt="icon" src={twitter_white} />
                            </IconButton>
                            <IconButton
                                onClick={() => openTelegram()}
                            >
                                <img alt="icon" src={telegram_white} />
                            </IconButton>
                        </Box>
                    </Box>
                </Dialog>}
            </Box>
        </Box>
    )
}

export default Landing;