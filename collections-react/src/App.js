import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0xD7998B3E5b1cdDF43a672b0c08390d9400f1A1d9";

function App() {

  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);


  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }


  const data = [
    {
      url: "./assets/images/cartoon1.jpg",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmX8qUaCzqKJp3aZPKkPw7DgLnKhjHRMA21AGdi5YuBQ2e/cartoon1.jpg')",
    },
    {
      url: "./assets/images/cartoon2.jpg",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmX8qUaCzqKJp3aZPKkPw7DgLnKhjHRMA21AGdi5YuBQ2e/cartoon2.jpg')",
    },
    {
      url: "./assets/images/cartoon3 (1).jpg",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmX8qUaCzqKJp3aZPKkPw7DgLnKhjHRMA21AGdi5YuBQ2e/cartoon3%20%281%29.jpg')",
    },
    {
      url: "./assets/images/cartoon4.jpg",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmX8qUaCzqKJp3aZPKkPw7DgLnKhjHRMA21AGdi5YuBQ2e/cartoon4.jpg')",
    },
    {
      url: "./assets/images/cartoon5.jpg",
      param: "handleMint('https://gateway.pinata.cloud/ipfs/QmX8qUaCzqKJp3aZPKkPw7DgLnKhjHRMA21AGdi5YuBQ2e/cartoon5.jpg')",
    },
  ];

  async function withdrawMoney() {
    try {

      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }

  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
    finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
        <div className="container">
          <br />
          <h1> 🔮 metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>

          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <br />
        <h1> 🔮 CREATIVE US </h1>

        <h2>NFT Marketplace</h2>
        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt="images"
              width={250}
              height={250}
            />
            <button isLoading={isMinting}
              onClick={() => {
                eval(item.param);
              }}
            >
              Mint - 0.01 eth
            </button>
          </div>
        ))} <br />
        <button
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>

      </div>

    </>
  );
}

export default App;