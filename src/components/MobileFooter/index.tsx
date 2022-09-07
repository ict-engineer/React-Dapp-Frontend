import React, {useEffect} from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import nav_home from '../../assets/images/nav_home.png';
import nav_swap from '../../assets/images/nav_swap.png';
import nav_pool from '../../assets/images/nav_pool.png';
import nav_farms from '../../assets/images/nav_farm.png';
import nav_fastbar from '../../assets/images/nav_fastbar.png';
import nav_home_active from '../../assets/images/nav_home_active.png';
import nav_swap_active from '../../assets/images/nav_swap_active.png';
import nav_pool_active from '../../assets/images/nav_pool_active.png';
import nav_farms_active from '../../assets/images/nav_farm_active.png';
import nav_fastbar_active from '../../assets/images/nav_fastbar_active.png';
import { useHistory } from 'react-router';
import { injected, walletconnect, walletlink, fortmatic, portis, lattice } from '../../connectors'
import { useActiveWeb3React } from '../../hooks'
import useStyles from "../../assets/styles";

export default function MobileFooter() {
  const history = useHistory();
  const classes = useStyles.footer();
  const { connector } = useActiveWeb3React()
  const isMetamask = window.ethereum //&& window.ethereum.isMetaMask
  let walletId = '0';
  if(isMetamask){
      walletId = '1';
  }else if(connector === walletconnect || connector === lattice || connector === walletlink || connector === fortmatic || connector === portis){
    walletId = '2';
  }
  const [value, setActiveTab] = React.useState(1);
  const History = useHistory();
  const gotoPage = (page: any) => {
    History.push(`/${page}`);
  };
  const currentActiveTab = sessionStorage.getItem("currentActiveTab") as any
  const unlisten = history.listen((location: any) => {
    if (window.location.pathname.includes('serve') || window.location.pathname.includes('account'))
      setActiveTab(9)
    else if(window.location.pathname.includes('swap'))
      setActiveTab(1)
    else if(window.location.pathname.includes('pool'))
      setActiveTab(2)
  });
  useEffect(() => {
    if (window.location.pathname === "/swap"){
      setActiveTab(1)
    }
    else{
      setActiveTab(parseInt(currentActiveTab))
    }
  }, [window.location.pathname, value, currentActiveTab]);
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setActiveTab(newValue);
        sessionStorage.setItem("currentActiveTab", newValue);
        if(newValue === 0){
          gotoPage('home')
          sessionStorage.setItem("activeDrawer", 'overview');
        }else if(newValue === 1)
          gotoPage('swap')
        else if(newValue === 2)
          gotoPage('pool')
        else if(newValue === 3)
          gotoPage('farms')
        else if(newValue === 4)
          gotoPage('fastbar/'+walletId)
      }}
      showLabels
      className={classes.mobilefooter}
    >
      <BottomNavigationAction label="Home" icon={ value !== 0 ? <img alt="nav_home" src={nav_home} /> : <img alt="nav_home_active" src={nav_home_active} />} />
      <BottomNavigationAction label="Swap" icon={ value !== 1 ? <img alt="nav_swap" src={nav_swap} /> : <img alt="nav_swap_active" src={nav_swap_active} />} />
      <BottomNavigationAction label="Pool" icon={ value !== 2 ? <img alt="nav_pool" src={nav_pool} /> : <img alt="nav_pool_active" src={nav_pool_active} />} />
      <BottomNavigationAction label="Farms" icon={ value !== 3 ? <img alt="nav_farms" src={nav_farms} /> : <img alt="nav_farms_active" src={nav_farms_active} />} />
      <BottomNavigationAction label="Fastbar" icon={ value !== 4 ? <img alt="nav_fastbar" src={nav_fastbar} /> : <img alt="nav_fastbar_active" src={nav_fastbar_active} />} />
    </BottomNavigation>
  );
}
