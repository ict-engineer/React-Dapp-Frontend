
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { environment } from '../constants/environments/environment';
import { useHistory } from 'react-router-dom';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";

import { getChainData, sanitizeHex } from "./utils";
import { BehaviorSubject, Observable } from 'rxjs';

import WalletConnectProvider from "@walletconnect/web3-provider";
import { apiGetAccountNonce, apiGetGasPrices } from './api';
import { convertAmountToRawNumber, convertStringToHex } from './bignumber';

export class ApiWalletService {
  private behave = new BehaviorSubject<Object>('');
  private onConnectBehave = new BehaviorSubject<Object>('');

  connector: any;
  enqueuesnackbar: any;
  constructor() {
    // const that = this;
    
    const { enqueueSnackbar } = useSnackbar();
    this.enqueuesnackbar = enqueueSnackbar;
    
    const provider = new WalletConnectProvider({
      infuraId: "5918063957ef4e8bae0348d54fa14ebb" // Required
    });

    if (provider) {
      if (provider.wc && provider.wc['connected']) {
        // console.log('-----------conne', provider.wc['_chainId'])
        const activeChain = provider.wc['chainId'] ? getChainData(provider.wc['chainId']).name : null;
        this.setBehaviorView({
          walletAddress: provider.wc['accounts'][0],
          networkName: activeChain,
          connected: true,
          chainId: provider.wc['chainId']
        })

        provider.on("open", (d: any) => {
          console.log("open", d);
        });


      } else {
        // console.log('---------not--conne')

        this.setBehaviorView({
          walletAddress: '',
          networkName: '',
          connected: false,
          chainId: 0
        })

      }
    }
    // console.log('---------------provider--------||', provider);

  }

  setBehaviorView(behave: object) {
    this.behave.next(behave);
  }

  /** Get Behavior for user registraion */
  getBehaviorView(): Observable<object> {
    return this.behave.asObservable();
  }

  setOnConnectBehaviorView(behave: object) {
    this.onConnectBehave.next(behave);
  }

  /** Get Behavior for user registraion */
  getOnConnectBehaviorView(): Observable<object> {
    return this.onConnectBehave.asObservable();
  }

  // -------------------------wallet Connect code
  public walletConnectInit = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    this.connector = connector;
    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }

    // // subscribe to events
    await this.subscribeToEvents();
  }


  public subscribeToEvents = () => {

    if (!this.connector) {
      return;
    }

    this.connector.on("session_update", async (error: any, payload: any) => {
      if (payload && payload.params && payload.params.length) {
        console.log(`connector.on("session_update")`, payload);
        window.location.reload();
      }
      if (error) {
        throw error;
      }
    });


    this.connector.on("connect", (error:any, payload:any) => {
      const activeChain = this.connector.chainId ? getChainData(this.connector.chainId).name : null;
      const address = this.connector.accounts[0];

      if (error) {
        throw error;
      }
      this.setBehaviorView({
        walletAddress: address,
        networkName: activeChain,
        connected: true,
        chainId: this.connector.chainId
      })

      this.setOnConnectBehaviorView({
        connected: true
      })

    });

    this.connector.on("disconnect", (error:any, payload:any) => {
      console.log(`connector.on("disconnect")`, payload);
      this.killSession();
      if (error) {
        throw error;
      }
      this.setBehaviorView({
        walletAddress: '',
        networkName: '',
        connected: false,
        chainId: 0
      })
    });

    // this.connector = this.connector;
  };

  public killSession = async () => {
    if (this.connector) {
      this.connector.killSession();
      this.connector = '';
    }
    const history = useHistory();
    history.push('swap')

  };

  // exportInstance
  async exportInstance(networkName:any, contractAddress:any, ABI:any) {

    let web3;
    if (networkName === 'Ropsten') {
      web3 = new Web3("https://ropsten.infura.io/v3/5918063957ef4e8bae0348d54fa14ebb");
    } else if (networkName === 'Mainnet') {
      web3 = new Web3("https://mainnet.infura.io/v3/5918063957ef4e8bae0348d54fa14ebb");
    }
    else if (networkName === 'Görli') {
      web3 = new Web3("https://goerli.infura.io/v3/5918063957ef4e8bae0348d54fa14ebb");
    }
    else if (networkName === 'Rinkeby') {
      web3 = new Web3("https://rinkeby.infura.io/v3/5918063957ef4e8bae0348d54fa14ebb");
    }
    return await new (web3 as any).eth.Contract(ABI, contractAddress);
  }

  //balanceOf
  getBalance(contractInstance:any, userWalletAccount:any) {
    return new Promise(async (resolve, reject) => {
      if (!userWalletAccount) {
        
        this.enqueuesnackbar('Wallet connection failed.', { variant : "error" }); 
        return;
      }
      let result = await contractInstance.methods.balanceOf(userWalletAccount).call({
        from: userWalletAccount
      });
      if (result) {
        resolve(result / environment.divideValue);
      } else {
        reject('err');
      }

    });

  }


  allowance(contractInstance:any, walletAddress:any, contractAddress:any) {
    return new Promise(async (resolve, reject) => {
      if (!walletAddress) {
        console.log('Metamask/Wallet connection failed.');
        this.enqueuesnackbar('Metamask/Wallet connection failed.', { variant : "error" });
        return;
      }

      let result = await contractInstance.methods.allowance(walletAddress, contractAddress).call({
        from: walletAddress
      });

      if (result) {
        let returnValue = (result / environment.divideValue).toFixed(10);
        resolve(returnValue);
      } else {
        reject('err');
      }

    });
  }


  async approve(contractInstance:any, contractAddress:any, _balance:any, userAccount:any, chainId:any) {
    _balance = await convertAmountToRawNumber(_balance);

    return new Promise(async (resolve, reject) => {


      const from = userAccount;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(userAccount, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      const gasPrices = await apiGetGasPrices();
      const _gasPrice = gasPrices.slow.price;
      const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 30000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));
      // const _value = 0;
      // const value = sanitizeHex(convertStringToHex(_value));

      await this.walletConnectInit();

      let uniqueAddress = await contractInstance.methods.approve(contractAddress, _balance).encodeABI();
      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,

        data: await uniqueAddress
      };

      if (this.connector) {

        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        console.log('-------------else')
      }
    })
  }

  async enter(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    // _balance = _balance * 1e18;
    _balance = await convertAmountToRawNumber(_balance);

    return new Promise(async (resolve, reject) => {


      const from = walletAddress;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(walletAddress, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 22000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.enter(_balance).encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };

      if (this.connector) {
        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }

    })
  }

  async leave(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    // _balance = _balance * 1e18;
    _balance = await convertAmountToRawNumber(_balance);

    return new Promise(async (resolve, reject) => {


      const from = walletAddress;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(walletAddress, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 22000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.leave(_balance).encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };

      if (this.connector) {
        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }

    })
  }

  async convert(contractInstance:any, _add1:any, add2:any, walletAddress:any, chainId:any) {

    return new Promise(async (resolve, reject) => {


      const from = walletAddress;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(walletAddress, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 22000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.convert(_add1, add2).encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };

      if (this.connector) {
        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }

    })
  }


  //---------------for FARMS

  // --dn
  async approveF(contractInstance:any, walletAddress:any, _balance:any, userAccount:any, chainId:any) {


    return new Promise(async (resolve, reject) => {


      const from = userAccount;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(userAccount, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      const gasPrices = await apiGetGasPrices();
      const _gasPrice = gasPrices.slow.price;
      const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 30000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));
      // const _value = 0;
      // const value = sanitizeHex(convertStringToHex(_value));

      // await this.walletConnectInit();

      let uniqueAddress = await contractInstance.methods.approve(walletAddress, _balance).encodeABI();
      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,

        data: await uniqueAddress
      };
      console.log('------------uniqueAddress', contractInstance['_address']);

      console.log('------------uniqueAddress', uniqueAddress);

      if (this.connector) {
        console.log('------------conn',);

        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        console.log('-------------else')
      }

    })

  }


  // --dn
  async stakeF(contractInstance:any, _balance:any, userAccount:any, chainId:any) {
    return new Promise(async (resolve, reject) => {


      const from = userAccount;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(userAccount, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 22000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.stake(_balance).encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };

      if (this.connector) {
        return this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }

    })

  }

  // --dn
  allowanceF(contractInstance:any, walletAddress:any, contractAddress:any) {
    return new Promise(async (resolve, reject) => {
      if (!walletAddress) {
        this.enqueuesnackbar('Metamask/Wallet connection failed.', { variant : "error" });
        return;
      }
      let result = await contractInstance.methods.allowance(walletAddress, contractAddress).call({
        from: walletAddress
      });
      if (result) {
        resolve(result);
      } else {
        reject(0);
      }

    });
  }

  //---- dn
  async withdrawF(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    return new Promise(async (resolve, reject) => {

      const from = walletAddress;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(walletAddress, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      const _gasLimit = 22000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.withdraw(_balance).encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };


      if (this.connector) {
        this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }

    })
  }

  getRewardF(contractInstance:any, walletAddress:any, chainId:any) {

    return new Promise(async (resolve, reject) => {

      const from = walletAddress;
      const to = contractInstance['_address'];
      const _nonce = await apiGetAccountNonce(walletAddress, chainId);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      // const gasPrices = await apiGetGasPrices();
      // const _gasPrice = 100;
      // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      // const _gasLimit = 22000;
      // const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

      let res = await contractInstance.methods.getReward().encodeABI();

      let txnObject = {
        from: from,
        to: to,
        // gasPrice: gasPrice,
        // gas: gasLimit,
        // value: "0x0",
        nonce: nonce,
        data: res
      };

      if (this.connector) {
        this.connector.sendTransaction(txnObject)
          .then((result:any) => {
            // Returns transaction id (hash)
            resolve(result);
          })
          .catch((error:any) => {
            // Error returned when rejected
            reject(error);
          });
      } else {
        reject('Please connect with wallet.')
      }
    })
  }

  lastTimeStakedF(contractInstance:any, walletAddress:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.lastTimeStaked(walletAddress).call({ from: walletAddress }).then((data:any) => {
        if (data) {
          resolve(data);
        }
      }).catch((er:any) => {
        if (er) {
          reject(er);
        }
      })
    })
  }

  lastTimeRewardedF(contractInstance:any, walletAddress:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.lastTimeRewarded(walletAddress).call({ from: walletAddress }).then((data:any) => {
        if (data) {
          resolve(data);
        }
      }).catch((er:any) => {
        if (er) {
          reject(er);
        }
      })
    })
  }


  getBalanceF(contractInstance:any, userWalletAccount:any) {
    return new Promise(async (resolve, reject) => {
      if (!userWalletAccount) {
        console.log('Metamask/Wallet connection failed.');
        this.enqueuesnackbar('Metamask/Wallet connection failed.', { variant : "error" });
        return;
      }
      let result = await contractInstance.methods.balanceOf(userWalletAccount).call({
        from: userWalletAccount
      });
      if (result) {
        resolve(result);
      } else {
        reject('err');
      }

    });

  }


  async earnedF(contractInstance:any, walletAddress:any) {
    return new Promise(async (resolve, reject) => {
      let result = await contractInstance.methods.earned(walletAddress).call({ from: walletAddress })

      if (result) {
        resolve(result);
      } else {
        reject('err');
      }
    })
  }


  totalSupplyF(contractInstance:any, userWalletAccount:any) {
    return new Promise(async (resolve, reject) => {
      if (!userWalletAccount) {
        this.enqueuesnackbar('Wallet connection failed.', { variant : "error" });
        return;
      }
      let result = await contractInstance.methods.totalSupply().call({
        from: userWalletAccount
      });
      if (result) {
        resolve(result);
      } else {
        reject('err');
      }

    });

  }

}
