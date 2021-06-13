import './App.css';
import { useEffect, useState } from 'react';
import ipfs from "./ipfs";
const Buffer = require('buffer/').Buffer;
// const ipfs = require('./ipfs');1
const ABI = require('./ABI.json');
const Web3 = require('web3');

function App() {

  const [hash, setHash] = useState('');
  const [accounts, setAccounts] = useState();
  const [instance, setInstance] = useState();

  useEffect(() => {
    if (window.ethereum) {
      let _web3 = new Web3(window.ethereum);
      let instance = new _web3.eth.Contract(ABI, '0xAA4d4a719fbab8c679667A68a91B18E80D0CEe1d');
      setInstance(instance);

      window.ethereum.enable().then(async data => {
          let _accounts = await _web3.eth.getAccounts();
          setAccounts(_accounts);
      }).catch(console.error);
    }
  }, []);
  
  const captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    let reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      saveToIpfs(reader);
    }
  }

  const getHashFromSC = async () => {
    const _hash = await instance.methods.getHash().call();
    setHash(_hash);
  }

  const saveToIpfs = (reader) => {
    const buffer = Buffer(reader.result);

    ipfs.files.add(buffer, async (err, result) => {
      if(err){
        console.error(err);
        return;
      }

      //Storing to smart contract
      await instance.methods.setHash(result[0].hash).send({from: accounts[0]});

      //Fetching hash from smart contract to retrieve image from ipfs
      getHashFromSC();
    });
  }

  return (
    <div className="App">
      <input type='file' onChange={captureFile} accept="image/*"/>
      {hash === '' ? null : 
      <div>
        <p>Hash of the file: {hash}</p>
        <img src={`http://localhost:8080/ipfs/${hash}`} alt='Not available' style={{
          marginTop: '20px'
        }}/>
      </div>
      }
    </div>
  );
}

export default App;
