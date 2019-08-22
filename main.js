const {
  Blockchain,
  Transaction
} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const fs = require("fs");
const JSON_FOLDER = "screwdriver/";
const TRANSACTION_COST = 10;

var screwdriverIterator = 147949;
var path;
/**
 * Read new JSON file
 */

function iterateToNextScrewdriverJSON() {
  screwdriverIterator++;
  path = "Cycle_" + screwdriverIterator.toString() + ".json";

  try {
    return JSON.parse(fs.readFileSync(JSON_FOLDER + path, "utf8"));
  } catch (error) {
    return error;
  }

  /*
  not async => encountered nodejs bug here same bug in linux
  https://github.com/nodejs/node/issues/2949
  */
}

var cycleObj = iterateToNextScrewdriverJSON();
var cycleArray = new Array();

this.loadjsonfiles = function () {
  while (true) {
    if (typeof cycleObj.cycle != "undefined") {
      // Assign value to the property here

      cycleArray.push(cycleObj.cycle);
      console.log("Cycle Loaded to Array: " + cycleObj.cycle);
      cycleObj = iterateToNextScrewdriverJSON();
    } else {
      //console.log(cycleObj.code);
      //File does not exist
      break;
    }
  }
}


/**
 * 
 * @param {string} length Random string's length 
 */
function randstr(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const key = ec.keyFromPrivate('fj1Dw0mHmwZNRCOxd3SnlktqKlSZhPoOvuefdKsjVTfDQHE9NihMLH1ASO1eFzFCp');
const address = key.getPublic('hex');

let cycleChain = new Blockchain();

/**
 * All in one block
 */
this.writeCyclesToBlockchain = function () {
  console.log("\nBalance of Wallet is ", cycleChain.getBalanceOfAddress(address), " \n");

  for (let index = 0; index < cycleArray.length; index++) {
    const tx = new Transaction(address, randstr(65), TRANSACTION_COST, cycleArray[index]);
    tx.signTransaction(key);
    console.log("Cycle Payload loaded to Transaction:" +
      tx.getPayload());
    cycleChain.addTransaction(tx);
  }

  cycleChain.minePendingTransactions(address);

  console.log("\nBalance of Wallet is ", cycleChain.getBalanceOfAddress(address), " \n");
}

/**
 * Each transaction has its own block
 */
this.writeEachCycleToBlockchain = function () {
  console.log("\nBalance of Wallet is ", cycleChain.getBalanceOfAddress(address), " \n");

  for (let index = 0; index < cycleArray.length; index++) {
    const tx = new Transaction(address, randstr(65), TRANSACTION_COST, cycleArray[index]);
    tx.signTransaction(key);
    console.log("Cycle Payload loaded to Transaction:" +
      tx.getPayload());
    cycleChain.addTransaction(tx);
    cycleChain.minePendingTransactions(address);
    console.log("\nBalance of Wallet is ", cycleChain.getBalanceOfAddress(address), " \n");
  }

}

this.totalAmount = function () {
  return cycleChain.calculateTotalAmount();
}

this.printchain = function () {
  return cycleChain.printTransactions();
}