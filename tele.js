var Web3 = require('web3');
const Common = require( '@ethereumjs/common' ).default;
var url = 'wss://ropsten.infura.io/ws/v3/3b7928f4026a4e12a18f3ff6810d9cdb'
var web3 = new Web3(new Web3.providers.WebsocketProvider(url));
const routerABI = require('./uniswapABI.json');
const weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const tokenaddy = '0x67D3899e20395b8476860da7511d03D88a142FB0';
const originalAmountToBuyWith = '0.002';
// SPECIFY_THE_AMOUNT_OF_Eth_YOU_WANT_TO_BUY_FOR_HERE

const EthAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

var PrivateKeys = 'b4b2fa50c192bf8f94d7a8cfc4a989240084c1babaf3befd74b44a348ed1c20a'
var walletAddress = '0x273b1E4f0f3b697765d929d10f10Fe3BA07db0eA';
// console.log(`Buying ONLYONE for ${originalAmountToBuyWith} BNB from pancakeswap for address ${walletAddress}`);

var res = buyOnlyone(PrivateKeys, EthAmount);
console.log(res);

async function buyOnlyone(targetAccount, amount) {
    var amountToBuyWith = web3.utils.toHex(amount);
    var privateKey = Buffer.from(PrivateKeys, 'hex');
    var tokenAddress = tokenaddy; // contract address
    var WethAddress = weth; // weth token address    
    var amountOutMin = '0';
    var UniswapRouterAddy = router;
    // console.log(amountToBuyWith, privateKey, tokenAddress, WethAddress, amountOutMin, UniswapRouterAddy);

    var chain = new Common( { chain : 'mainnet', hardfork : 'london' } );
    var routerAbi = routerABI;
    var contract = new web3.eth.Contract(routerAbi, UniswapRouterAddy);
    var data = contract.methods.swapExactETHForTokens(
        web3.utils.toHex(amountOutMin),
        [WethAddress,
         tokenAddress],
        walletAddress,
        web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
    );
    var count = await web3.eth.getTransactionCount("0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8");
    // var count =web3.eth.getTransactionCount("0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", function(error, txCount) {
    //  }); 
    // console.log(count);
    return "ak";
}