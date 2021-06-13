const ipfsApi = require('ipfs-api');
const ipfs = ipfsApi({host:'localhost',port:'5001',protocol:'http'});
export default ipfs;