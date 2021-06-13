// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Ipfs {
    string hash;
    
    constructor() {}
    
    function setHash(string memory _hash) public {
        hash = _hash;
    }
    
    function getHash() public view returns(string memory){
        return hash;
    }
}