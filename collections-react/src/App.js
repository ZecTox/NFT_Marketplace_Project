import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x9a4b76e415083b7d95BDA0d94f031AD5fc33Ae31";

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
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
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
  async function handleMint(tokenURI) {
    setIsMinting(true);
        try {
          const options = {value: ethers.utils.parseEther("0.01")};
          const response = await NFTContract.mintNFT(tokenURI, options);
          console.log("Received: ", response);
        } catch (err) {
            alert(err);
        }
        finally {
          setIsMinting(false);
        }
}

    const data = [
        {
            url: "images/1.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png')",
        },
        {
            url: "images/2.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png')",
        },
        {
            url: "images/3.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png')",
        },
        {
            url: "images/4.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png')",
        },
        {
            url: "images/5.png",
            param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png')",
        },
    ];

    async function withdrawMoney(){
        try {
 
            const response = await NFTContract.withdrawMoney();
            console.log("Received: ", response);
          } catch (err) {
              alert(err);
          }
          
    }
    if (account === null) {
      return (
        <>
         <div className="container">
           <br/>
          <h1>🖼️ ZecTox's NFT MarketPlace 🎨</h1>
          <p> Buy a NFT from our marketplace 😁 </p>
  
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
            <br/>
            <h1>🖼️ ZecTox's NFT MarketPlace 🎨</h1>
            <p> 💵 Buy a NFT and Mint it 💰 </p>
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
                ))}
                <div style={{display:"block"}}>
                <button onClick={() => {withdrawMoney();}}>
                            Withdraw Money from Contract
                 </button>
                </div>
        </div>
        </>
    );
}
export default App;