import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { environment } from '../constants/environments/environment';

declare let window: any;

export class ApiService {

  userAccount: any;
  enqueuesnackbar: any;
  constructor() {
    const { enqueueSnackbar } = useSnackbar();
    this.enqueuesnackbar = enqueueSnackbar;
    // const that = this;
    if (window.ethereum) {

      window.web3 = new Web3(window.web3.currentProvider);

      window.ethereum.autoRefreshOnNetworkChange = true;

      // window.ethereum.on('accountsChanged', function (accounts) {

      //   window.location.reload();
      //   // Time to reload your interface with accounts[0]!
      // })
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log('----acc changed----', accounts);
        console.log('----this.userAccount----', this.userAccount);
        if (accounts.length) {
          if (this.userAccount != accounts[0]) {

            this.userAccount = accounts[0];
            window.location.reload();
          }

        }
        // window.location.reload();
      });
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // commented for future use

    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

  }

  getNetworkName() {
    if (window.ethereum && window.ethereum.chainId) {
      if (window.ethereum.chainId === "0x1") {
        return environment.main;
      }
      else if (window.ethereum.chainId === "0x3") {
        return environment.rops;
      }
      else if (window.ethereum.chainId === "0x4") {
        return environment.rinkeby;
      }
      else if (window.ethereum.chainId === "0x5") {
        return environment.Goerli;
      }
      else if (window.ethereum.chainId === "0x2a") {
        return environment.Kovan;
      }else{
        return environment.main;
      }
    }else{
      return environment.main;
    }
  }


  connect() {
    if (window.ethereum) {
      // commented for future use
      return new Promise((resolve, reject) => {

        let temp = window.ethereum.enable();
        if (temp) {
          resolve(temp)
        } else {
          reject('err');
        }

      })
    }else{
      return;
    }
  }

  // --dn
  async exportInstance(SCAddress:any, ABI:any) {
    return await new window.web3.eth.Contract(ABI, SCAddress);
  }
  // --dn
  async export() {
    if (window.web3) {
      return new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((error:any, result:any) => {

          // just 1 min jo
          if (error != null) {
            resolve([]);
          }
          if (result === undefined || result.length === 0) {
            // alert("No account found! Make sure the Ethereum client is configured properly.");
            resolve([]);
          } else {

            let account = result[0];

            window.web3.eth.defaultAccount = account;
            this.userAccount = account;
            resolve(account)
          }
        })
      })
    } else {
    //   Toast.notify('No account found! Make sure the Ethereum client is configured properly.', {duration: 'top-right'} as any);
    }

  }

  // --dn

  getBalance(contractInstance:any, userWalletAccount:any) {
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
        result = await Web3.utils.fromWei(`${result}`);
        resolve(result);
      } else {
        reject('err');
      }

    });

  }

  allowance(contractInstance:any, walletAddress:any, contractAddress:any) {
    return new Promise(async (resolve, reject) => {
      if (!walletAddress) {
        this.enqueuesnackbar('Metamask/Wallet connection failed.', { variant : "error" });
        return;
      }
      let result = await contractInstance.methods.allowance(walletAddress, contractAddress).call({
        from: walletAddress
      });
      if (result) {
        result = Web3.utils.fromWei(`${result}`)
        resolve(result);
      } else {
        reject(0);
      }

    });
  }


  // --dn
  async approve(contractInstance:any, walletAddress:any, _balance:any, userAccount:any, chainId:any) {
    _balance = Web3.utils.toWei(`${_balance}`)

    return new Promise((resolve, reject) => {

      contractInstance.methods.approve(walletAddress, _balance).send({ from: userAccount }).then((data:any) => {
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


  async enter(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    // _balance = _balance * 1e18;
    _balance = await Web3.utils.toWei(`${_balance}`);

    return new Promise((resolve, reject) => {

      contractInstance.methods.enter(_balance).send({ from: walletAddress }).then((data:any) => {
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



  async leave(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    // _balance = _balance * 1e18;
    _balance = await Web3.utils.toWei(`${_balance}`);

    return new Promise((resolve, reject) => {

      contractInstance.methods.leave(_balance).send({ from: walletAddress }).then((data:any) => {
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



  async convert(contractInstance:any, _add1:any, add2:any, walletAddress:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.convert(_add1, add2).send({ from: walletAddress }).
        then((data:any) => {
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




  //---------------for FARMS

  // --dn
  async approveF(contractInstance:any, walletAddress:any, _balance:any, userAccount:any, chainId:any) {

    return new Promise((resolve, reject) => {

      console.log('---------------_balance', _balance)

      contractInstance.methods.approve(walletAddress, _balance).send({ from: userAccount }).then((data:any) => {
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

  // --dn
  async stakeF(contractInstance:any, _balance:any, userAccount:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.stake(_balance).send({ from: userAccount }).then((data:any) => {
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


  //---- dn
  async withdrawF(contractInstance:any, _balance:any, walletAddress:any, chainId:any) {
    return new Promise((resolve, reject) => {

      contractInstance.methods.withdraw(_balance).send({ from: walletAddress }).then((data:any) => {
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

  getRewardF(contractInstance:any, walletAddress:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.getReward().send({ from: walletAddress }).then((data:any) => {
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


  exitF(contractInstance:any, walletAddress:any, chainId:any) {

    return new Promise((resolve, reject) => {

      contractInstance.methods.exit().send({ from: walletAddress }).then((data:any) => {
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
        console.log('Metamask/Wallet connection failed.');
        this.enqueuesnackbar('Metamask/Wallet connection failed.', { variant : "error" });
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

}
