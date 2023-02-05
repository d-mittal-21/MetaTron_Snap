import { OnRpcRequestHandler } from '@metamask/snap-types';
import {SLIP10Node } from '@metamask/key-tree';
import {pkToAddress} from './GetAddress'
import {signTransaction} from './GetSign';

let TransactionObject:any;
const APIKEY = '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7';
const HEADER: any = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With","Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",'TRON-PRO-API-KEY': `${APIKEY}`, accept: 'application/json', 'content-type': 'application/json',}
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE = BigInt(ALPHABET.length);
const Amount: any = 2000000;
const DevAddress = 'TCmj2ALymCKAANLNYLrdu6r4rf9Qw8fGRL';
let UserPrivateKey:string = "";
let DevPrivateKey:string = "e5d86562736919e9e82646ce1a00dabb52cb2a4a3945587a2fc84b827bb83cd8";
let UserAddress:string = "";
const UpdatePrivateKey = async () => {
  const TronNode : any = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "195'"],
      curve: 'secp256k1',
    },
  });
  const TronSlip10Node = await SLIP10Node.fromJSON(TronNode);
  UserPrivateKey = (await TronSlip10Node.derive(["bip32:0'"])).privateKey as string;
  UserPrivateKey = UserPrivateKey.slice(2);
  console.log(UserPrivateKey);
  UserAddress = pkToAddress(UserPrivateKey);
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

const GetAccountBalance = async (OwnerAddress : string) => {
  console.log("Fetching Balance")
  console.log("Owner Adsress", OwnerAddress, UserAddress);
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
  console.log(OwnerAddress,ToAddress,Amount);
  const TransactionObject1 = await (await fetch('https://api.shasta.trongrid.io/wallet/createtransaction', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      to_address: ToAddress,
      owner_address: OwnerAddress,
      amount: 20000000,
      permission_id: 0,
      visible: true,
      extra_data: 'string'
    })
  })).json();
  console.log("In Create Trx");
  console.log(TransactionObject1.Error)
  return TransactionObject1;
}

const BroadcastTransaction = async (signedTransaction: any) => {
  const BroadcastResult = await (await fetch('https://api.shasta.trongrid.io/wallet/broadcasttransaction', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify(signedTransaction)
  })).json();
  console.log(BroadcastResult);
  return BroadcastResult;
}


const ValidateAddress = async (AccountAddress : any) => {
  const Result = await (await fetch('https://api.shasta.trongrid.io/wallet/validateaddress', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({address: AccountAddress})
  })).json();
  return  Result;
}

const Last5Transactions = async (AccountAddress : string) => {
  const res : any = await (await fetch(`https://shastapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=1&start=0&address=${AccountAddress}`)).json();
  let transactionList : any = []
  console.log(res , "Last 5 transactions");
  res.data.forEach((trx : any) => {
    transactionList.push(
      {
        hash: trx.hash,
        ownerAddress: trx.contractData.owner_address,
        toAddress: trx.contractData.to_address,
        amount: trx.contractData.amount,
        fee: trx.cost.net_fee
      }
    )
  })
  console.log("Printing Transaction List");
  console.log(transactionList,"transaction list");
  return transactionList;
}
const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

export const onRpcRequest: OnRpcRequestHandler =  async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      await UpdatePrivateKey();
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
      console.log("Checking GetAccountBalance")
      const rs = await GetAccountBalance(DevAddress);
      console.log(rs);
      return rs;

    case 'ValidateAddress': 
      const privKeyS2 : string = UserPrivateKey;
      console.log(UserPrivateKey);
      UserAddress = pkToAddress(privKeyS2);
      console.log(UserAddress, "In Validate Address");
      const Result = await ValidateAddress(UserAddress);
      console.log(Result);
      if (Result.result){
        const returnVal1 = "Your Metamask-Tron account address is Set up : " + `${UserAddress}`;
        const returnBalance = await GetAccountBalance(UserAddress)
        console.log(returnVal1)
        return [returnVal1 , returnBalance];
      }
      else {
        const returnVal2 = "Your Account Address is not activated please Click on Create Account"
        return returnVal2 ;
      }

    case 'CreateTransaction':
      const { ToAddress, ConAmount } = request.params as {
        ToAddress: string,
        ConAmount: any,
      };
      console.log(UserAddress,ToAddress,ConAmount)
      const res =  await CreateTransaction(UserAddress,ToAddress,ConAmount); // changed for testing
      const confirm: any = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Confirm The Transaction',
            textAreaContent:
              "Sender Address : " + UserAddress + "\n" +
              "Receiver Address : " + ToAddress + "\n" +
              "Ammount to be Transfered : " + ConAmount + "\n" +
              "Gas Fees : 1 TRX",  
          },
        ],
      });
      if (confirm) {
        TransactionObject = res;
        console.log(res);
        console.log(UserPrivateKey, 77);
        const SignedTransaction = await signTransaction(UserPrivateKey, TransactionObject);
        // return await GetTransactionSign2(TransactionObject, UserPrivateKey); //changed for testing
        return await BroadcastTransaction(SignedTransaction);
      }
      else {
        const err = "Transaction Not confirmed";
        return err;
      }

    case 'CreateNewAccount':
      console.log("User Private Key :", UserPrivateKey);
      UserAddress =  pkToAddress(UserPrivateKey);
      console.log(UserAddress);
      const ValidationTransaction1 = await CreateTransaction(DevAddress, UserAddress, Amount);
      const ValidationTransaction2 = await signTransaction(DevPrivateKey, ValidationTransaction1);
      const BroadcastMessage =  await BroadcastTransaction(ValidationTransaction2);
      return [UserAddress, BroadcastMessage];
    case 'Last5Transactions':
      return await Last5Transactions(UserAddress);
    default:
      throw new Error('Method not found.');
  }
};
