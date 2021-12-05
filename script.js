var fs = require('fs')
//var Tx = require('ethereumjs-tx').Transaction;
const { FeeMarketEIP1559Transaction } = require( '@ethereumjs/tx' );
const Common = require( '@ethereumjs/common' ).default;
var Web3 = require('web3');
const routerABI = require('./uniswapABI.json');
var add = 'wss://ropsten.infura.io/ws/v3/3b7928f4026a4e12a18f3ff6810d9cdb'
var web3 = new Web3(new Web3.providers.WebsocketProvider(add));

// Variables To Change via Telegram

const weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const tokenaddy = '0x67D3899e20395b8476860da7511d03D88a142FB0';
const originalAmountToBuyWith = '0.002';
const gaslimit = 500000;
const maxfee = '150';
const priorityfee = '120';

// SPECIFY_THE_AMOUNT_OF_Eth_YOU_WANT_TO_BUY_FOR_HERE

const EthAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

var PrivateKeys = 'b4b2fa50c192bf8f94d7a8cfc4a989240084c1babaf3befd74b44a348ed1c20a'
var walletAddress = '0x273b1E4f0f3b697765d929d10f10Fe3BA07db0eA';
console.log(`Buying ONLYONE for ${originalAmountToBuyWith} BNB from pancakeswap for address ${walletAddress}`);

var res = buyOnlyone(PrivateKeys, EthAmount);
console.log(res);

async function buyOnlyone(targetAccount, amount) {

    var amountToBuyWith = web3.utils.toHex(amount);
    var privateKey = Buffer.from(PrivateKeys, 'hex');
    var tokenAddress = tokenaddy; // contract address
    var WethAddress = weth; // weth token address    
    var amountOutMin = '0';
    var UniswapRouterAddy = router;

    var chain = new Common( { chain : 'ropsten', hardfork : 'london' } );

    var routerAbi = routerABI;
    var contract = new web3.eth.Contract(routerAbi, UniswapRouterAddy);
    var data = contract.methods.swapExactETHForTokens(
        web3.utils.toHex(amountOutMin),
        [WethAddress,
         tokenAddress],
        walletAddress,
        web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
    );

    var count = await web3.eth.getTransactionCount(walletAddress);
    var rawTransaction = {
        "from":walletAddress,
        //"gasPrice":web3.utils.toHex( web3.utils.toWei( '120' , 'gwei' ) ),
        "gasLimit":web3.utils.toHex(gaslimit),
        "maxFeePerGas": web3.utils.toHex( web3.utils.toWei(maxfee,'gwei')),
        "maxPriorityFeePerGas": web3.utils.toHex(web3.utils.toWei(priorityfee,'gwei')),
        "to":UniswapRouterAddy,
        "value":web3.utils.toHex(amountToBuyWith),
        "data":data.encodeABI(),
        "nonce":web3.utils.toHex(count),
        "type": "0x02"
    };

    const tx = FeeMarketEIP1559Transaction.fromTxData( rawTransaction , { chain } );
    //var transaction = new Tx(rawTransaction);
    const signedTransaction = tx.sign( privateKey );
    //transaction.sign(privateKey);

    const serializedTransaction = '0x' + signedTransaction.serialize().toString( 'hex' );
    const txHash = await web3.utils.sha3( serializedTransaction );
    console.log( "Tx Hash: " + txHash );
    // await web3.eth.sendSignedTransaction( serializedTransaction )
    // .on( 'error' , function( error ) {
    //     console.error( error )
    // });

    //var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    //console.log(result)
    //return result;
}