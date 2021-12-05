var Web3 = require('web3')
// var url = 'https://mainnet.infura.io/v3/05f992de6a6e467abdd671aa6c0de951'
var url = 'wss://ropsten.infura.io/ws/v3/3b7928f4026a4e12a18f3ff6810d9cdb'
var web3 = new Web3(url)
// console.log(web3);
var address = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8";
// var balance = web3.eth.getBalance(address, (err, bal) => {balance = bal})
// var bal = await web3.eth.getBalance(accounts[0]);
web3.eth.getBalance("0x273b1E4f0f3b697765d929d10f10Fe3BA07db0eA")
.then(console.log);
// console.log(bal)