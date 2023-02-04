import { OnRpcRequestHandler } from '@metamask/snap-types';
import { JsonSLIP10Node, SLIP10Node } from '@metamask/key-tree';
// import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
// import { fetchUrl } from './insights';
import {pkToAddress} from './utils2'
import { Keccak } from 'sha3';
import * as bs58 from 'bs58';
import {signTransaction} from './GetSign';


// import { secp256k1 } from 'secp256k1';
const secp256k1 = require('secp256k1')
let TransactionObject:any;
const APIKEY = '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7';
const HEADER: any = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With","Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",'TRON-PRO-API-KEY': `${APIKEY}`, accept: 'application/json', 'content-type': 'application/json',}

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE = BigInt(ALPHABET.length);
const Amount: any = 20000000;
const DevAddress = 'TCmj2ALymCKAANLNYLrdu6r4rf9Qw8fGRL';
const Url = "https://api.shasta.trongrid.io/wallet/easytransferbyprivate" // tron api for EasyTransferByPrivate
let PrivateKey:string = "";
let DevPrivateKey:string = "e5d86562736919e9e82646ce1a00dabb52cb2a4a3945587a2fc84b827bb83cd8";
let PublicKey:string = "";
let Address:string = "";
const foo = async () => {
  const TronNode : any = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      // Must be specified exactly in the manifest
      path: ['m', "44'", "195'"],
      curve: 'secp256k1',
    },
  });
  const TronSlip10Node = await SLIP10Node.fromJSON(TronNode);
  PublicKey = (await TronSlip10Node.derive(["bip32:0'"])).publicKey;
  PrivateKey = (await TronSlip10Node.derive(["bip32:0'"])).privateKey as string;
  Address = (await TronSlip10Node.derive(["bip32:0'"])).address as string;
  console.log(PublicKey);
  console.log(PublicKey.slice(4));
  console.log(PrivateKey);
  console.log(Address);
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const BASE = BigInt(ALPHABET.length);

  function hexToBase58(hex: string): string {
    let num = BigInt(hex);
    let str = '';
    while (num > 0) {
      let rem = Number(num % BASE);
      str = ALPHABET[rem] + str;
      num = num / BASE;
    }
    return str;
  }
  Address = hexToBase58(Address);
  console.log(Address);
}


function base58ToHex(base58: string): string {
  let hex = '';
  let number = BigInt(0);

  for (const char of base58) {
    number = number * BASE +  BigInt(ALPHABET.indexOf(char));
  }

  while (number > 0) {
    const remainder = number % BigInt(256);
    hex = `0${remainder.toString(16)}`.slice(-2) + hex;
    number = number / BigInt(256);
  }

  return hex;
}

// const tronWeb = new TronWeb({
//   fullHost: 'https://api.trongrid.io',
//   headers: { "TRON-PRO-API-KEY": APIKEY },
//   privateKey: PrivateKey
// })
const Hash = new Keccak(256);
const GetNewAddressHash = async () => {
  Hash.update(PublicKey.slice(4));
  var hash = Hash.digest('hex');
  console.log(hash, typeof hash);
  hash = hash.slice(-40);
  console.log(hash, typeof hash);
  // let hexHash = '';
  // for (let i = 0; i < hash.length; i++) {
  //   hexHash += hash.charCodeAt(i).toString(16);
  // }
  hash = '0x41' + hash;
  console.log(hash);
  Hash.update(hash);
  var hashOfHash = Hash.digest('hex');
  Hash.update(hashOfHash);
  hashOfHash = Hash.digest('hex');
  console.log(hashOfHash, typeof hashOfHash)
  const verificationCode = hashOfHash.slice(0,8);
  var address = hash + verificationCode;

  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const BASE = BigInt(ALPHABET.length);

  function hexToBase58(hex: string): string {
    let num = BigInt(hex);
    let str = '';
    while (num > 0) {
      let rem = Number(num % BASE);
      str = ALPHABET[rem] + str;
      num = num / BASE;
    }
    return str;
  }
  function base58ToHex(base58: string): string {
    let hex = '';
    let number = BigInt(0);
  
    for (const char of base58) {
      number = number * BASE +  BigInt(ALPHABET.indexOf(char));
    }
  
    while (number > 0) {
      const remainder = number % BigInt(256);
      hex = `0${remainder.toString(16)}`.slice(-2) + hex;
      number = number / BigInt(256);
    }
  
    return hex;
  }
  

  const address1 = hexToBase58(address);
  const address2 = 'T' + address1;
  const address3 = base58ToHex(address2);
  console.log(address3)
  console.log(address2)
  // console.log(address1)
  return address1;
} 

const options = {
  method: 'POST',
  headers: {'TRON-PRO-API-KEY': '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7', accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({UserPrivateKey: PrivateKey, toAddress: 'string', amount: 0})
};

const GetLatestBlock = async () => {
  const data: any = await (await fetch('https://api.shasta.trongrid.io/wallet/getnowblock')).json();
  return { blockID: data.blockID, number: data.block_header.raw_data.number }
}

const GetAccountBalance = async (OwnerAddress : string) => {
  console.log('GetAccountBalance', OwnerAddress);
  const {blockID, number} = await GetLatestBlock();
  console.log("Fetching Balance")
  const res = (await fetch('https://api.shasta.trongrid.io/wallet/getaccount', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      address: OwnerAddress,
      visible: true
    })
  }))
  
  console.log(res)
  const data = await res.json();
  console.log(data.balance)
  return data['balance']/1000000;
}

const CreateTransaction = async (OwnerAddress: string, ToAddress: string, Amount: Number) => {
  const TransactionObject1 = await (await fetch('https://api.shasta.trongrid.io/wallet/createtransaction', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      to_address: ToAddress,
      owner_address: OwnerAddress,
      amount: Amount,
      permission_id: 0,
      visible: true,
      extra_data: 'string'
    })
  })).json();
  return TransactionObject1;
}
const stringToHex = (str: string) => {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}
// const GetTransactionSign = async (TransactionObject1: any, PrivateKey: string) => {
//   var rawDataHex = JSON.stringify(TransactionObject1.raw_data)
//   rawDataHex = stringToHex(rawDataHex);
//   console.log("Hello")
//   const TransactionSign = await (await fetch('https://api.shasta.trongrid.io/wallet/gettransactionsign', {
//     method: 'POST',
//     headers: HEADER,
//     body: JSON.stringify({
//       transaction: {
//         raw_data: TransactionObject1.raw_data,
//         raw_data_hex : TransactionObject1.raw_data_hex,
//         txID: TransactionObject1.txID
        
//       },
//       privateKey: PrivateKey
//     })
//   })).json();

//   return { TransactionSign };
// }

// const GetTransactionSign2 = async (TransactionObject1: any, PrivateKey: string) => {
//   var enc = new TextEncoder();
//   const Id = enc.encode(TransactionObject1.txID);
//   const sign = secp256k1.ecdsaSign(Id, PrivateKey, { canonical: false });
//   console.log(sign.toHex() + Buffer.from([sign.getRecoveryParam()]).toString('hex'));
//   return sign.toHex() + Buffer.from([sign.getRecoveryParam()]).toString('hex');
// }

const BroadcastTransaction = async (signedTransaction: any) => {
  const BroadcastResult = await (await fetch('https://api.shasta.trongrid.io/wallet/broadcasttransaction', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify(signedTransaction)
  })).json();
  console.log(BroadcastResult);
  return BroadcastResult;
}

// const generateAccount = async () => {
//   const TronNode = await wallet.request({
//     method: 'snap_getBip32Entropy',
//     params: {
//       // Must be specified exactly in the manifest
//       path: ['m', "44'", "195'"],
//       curve: 'secp256k1',
//     },
//   });
// }
const createNewAccount = async (AccountAddress: any) => {
  const url = "https://api.shasta.trongrid.io/wallet/createaccount";
  const options = {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      owner_address: `${DevAddress}`,
      account_address: `${AccountAddress}`,
      visible: 'true'
    })
  }
  const res = await fetch(url, options);
  return await res.json();
}

const TransferTron = async () => {
  const response = await fetch('https://api.shasta.trongrid.io/wallet/easytransferbyprivate', options)

    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

  return response;
}

const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler =  async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'GetAccountBalance':
      // const Balance = GetAccountBalance();
      // return wallet.request({
      //   method: 'snap_confirm',
      //   params: [
      //     {
      //       prompt: getMessage(origin),
      //       description:
      //         'This custom confirmation is just for displaying Acount Balance. Your Current Balance is:',
      //       textAreaContent:
      //         Balance,
      //     },
      //   ],
      // })
      console.log("Checking GetAccountBalance")
      const rs = await GetAccountBalance(DevAddress);
      console.log(rs);
      return rs;

    case 'CreateTransaction':
      const { ToAddress } = request.params as {
        ToAddress: string
      };
      console.log(DevAddress,ToAddress,Amount)
      const res =  await CreateTransaction(DevAddress,ToAddress, Amount); // changed for testing
      TransactionObject = res;
      const SignedTransaction = await signTransaction(DevPrivateKey, TransactionObject);
      // return await GetTransactionSign2(TransactionObject, PrivateKey); //changed for testing
      return await BroadcastTransaction(SignedTransaction);

    case 'CreateNewAccount':
      await foo();
      console.log("User Private Key :", PrivateKey);
      const privKeyS : string = PrivateKey.slice(2);
      const address =  await pkToAddress(privKeyS);
      console.log(address);
      const ValidationTransaction1 = await CreateTransaction(DevAddress, address, Amount);
      const ValidationTransaction2 = await signTransaction(DevPrivateKey, ValidationTransaction1);
      return await BroadcastTransaction(ValidationTransaction2);


    default:
      throw new Error('Method not found.');
  }
};
