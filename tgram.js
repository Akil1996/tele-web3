var fs = require('fs')
//var Tx = require('ethereumjs-tx').Transaction;
const { FeeMarketEIP1559Transaction } = require( '@ethereumjs/tx' );
const Common = require( '@ethereumjs/common' ).default;
var Web3 = require('web3');
const routerABI = require('./uniswapABI.json');
var add = 'wss://ropsten.infura.io/ws/v3/3b7928f4026a4e12a18f3ff6810d9cdb'
var web3 = new Web3(new Web3.providers.WebsocketProvider(add));

var TelegramBot = require('node-telegram-bot-api')
var token = '2103562216:AAG5AABt9NtSjFO5fmeYF5Ca4ft5XZ2rnTY';
var bot = new TelegramBot(token, {polling:true});


// Variables To Change via Telegram

let weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
let router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

let tokenaddy = '0x67D3899e20395b8476860da7511d03D88a142FB0';
let originalAmountToBuyWith = '0.002';
let gaslimit = 500000;
let maxfee = '150';
let priorityfee = '120';
// SPECIFY_THE_AMOUNT_OF_Eth_YOU_WANT_TO_BUY_FOR_HERE

const EthAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

var PrivateKeys = 'b4b2fa50c192bf8f94d7a8cfc4a989240084c1babaf3befd74b44a348ed1c20a'
var walletAddress = '0x273b1E4f0f3b697765d929d10f10Fe3BA07db0eA';
console.log(`Buying ONLYONE for ${originalAmountToBuyWith} BNB from pancakeswap for address ${walletAddress}`);




async function buyOnlyone(targetAccount, amount, msgid) {

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
    bot.sendMessage( msgid, "Tx Hash: " + txHash)
    // await web3.eth.sendSignedTransaction( serializedTransaction )
    // .on( 'error' , function( error ) {
    //     console.error( error )
    // });

    //var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    //console.log(result)
    //return result;
}

bot.onText(/\/echo (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    var echo = match[1];
    bot.sendMessage(chatId, echo);
})

// Matches "/echo [whatever]"
bot.onText(/\/ak (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

bot.onText(/\/weth (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    weth = match[1];
    bot.sendMessage(chatId, "weth has changed");
})
bot.onText(/\/router (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    router = match[1];
    bot.sendMessage(chatId, "router has changed");
})

bot.onText(/\/tokenaddy (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    tokenaddy = match[1];
    bot.sendMessage(chatId, "tokenaddy has changed");
})

bot.onText(/\/oAmtBuy (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    originalAmountToBuyWith = match[1];
    bot.sendMessage(chatId, "originalAmountToBuyWith has changed");
})

bot.onText(/\/gaslimit (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    gaslimit = match[1];
    bot.sendMessage(chatId, "gaslimit has changed");
})

bot.onText(/\/maxfee (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    maxfee = match[1];
    bot.sendMessage(chatId, "maxfee has changed");
})

bot.onText(/\/priorityfee (.+)/, function(msg,match){
    var chatId = msg.chat.id;
    priorityfee = match[1];
    bot.sendMessage(chatId, "priorityfee has changed");
})


bot.onText(/\/view/, function(msg) {
    var msgVariables = "weth = " + weth+ "\n router = "+ router+ "\n tokenaddy = " + tokenaddy+ "\n originalAmountToBuyWith = " + originalAmountToBuyWith+ "\n gaslimit = "+ gaslimit + "\n maxfee = "+ maxfee+ ",\n priorityfee = "+ priorityfee;
    bot.sendMessage(msg.chat.id, msgVariables);
});

bot.onText(/\/start/, function(msg) {
    var msgVariables = "/weth = " + "To change weth variable" +"\n /router = "+ "To change router variable"+ "\n /tokenaddy = " + "To change tokenaddy variable"+ "\n /oAmtBuy = " + "To change originalAmountToBuyWith variable"+ "\n /gaslimit = "+ "To change gaslimit variable" + "\n /maxfee = "+ "To change maxfee variable"+ ",\n /priorityfee = "+ "To change priorityfee variable";
    bot.sendMessage(msg.chat.id, msgVariables);
});


bot.onText(/\/run/, function(msg) {
    var res = buyOnlyone(PrivateKeys, EthAmount, msg.chat.id);
    bot.sendMessage(msg.chat.id, "Running");
});