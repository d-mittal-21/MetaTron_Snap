import { OnRpcRequestHandler } from '@metamask/snap-types';
import {SLIP10Node } from '@metamask/key-tree';
import {pkToAddress} from './GetAddress'
import {signTransaction} from './GetSign';
import { OnTransactionHandler } from "@metamask/snap-types";
let TransactionObject:any;
const APIKEY = '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7';
const HEADER: any = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers":"Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
  'TRON-PRO-API-KEY': `${APIKEY}`, "accept": 'application/json', 
  'content-type': 'application/json',
}
const DEVADDRESS:string = 'TCmj2ALymCKAANLNYLrdu6r4rf9Qw8fGRL';
const DEVPRIVATEKEY:string = "e5d86562736919e9e82646ce1a00dabb52cb2a4a3945587a2fc84b827bb83cd8";
const GenerateUserData = async () => {
  const TronNode : any = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "195'"],
      curve: 'secp256k1',
    },
  });
  const TronSlip10Node = await SLIP10Node.fromJSON(TronNode);
  let UserPrivateKey : string = (await TronSlip10Node.derive(["bip32:0'"])).privateKey as string;
  UserPrivateKey = UserPrivateKey.slice(2);
  console.log(UserPrivateKey);
  let UserAddress = pkToAddress(UserPrivateKey);
  await storeUserData(UserAddress,UserPrivateKey);
}

const storeUserData = async (UserAddress : string,UserPrivateKey : string) => {
  return  await wallet.request({
      method: 'snap_manageState',
      params: ['update',{ UserAddress, UserPrivateKey}]
  });
}

const retrieveUserData = async()=> {
  return await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
});
}

const GetAccountBalance = async (OwnerAddress : string) => {
  console.log("Fetching Balance")
  console.log("Owner Adsress", OwnerAddress);
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
      amount: Amount,
      permission_id: 0,
      visible: true,
      extra_data: 'string'
    })
  })).json();
  console.log("In Create Trx");
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
  const res : any = await (await fetch(`https://shastapi.tronscan.org/api/transaction?sort=-timestamp&limit=5&count=true&start=0&address=${AccountAddress}`)).json();
  let transactionList : any = []
  console.log(res , "Last 5 transactions");
  res.data.forEach((trx : any) => {
    transactionList.push(
      {
        hash: trx.hash,
        ownerAddress: trx.contractData.owner_address,
        toAddress: trx.contractData.to_address,
        amount: trx.contractData.amount,
        fee: Number(trx.cost.fee)/1000000
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
    // case 'hello': {
    //   await GenerateUserData();
    //   return wallet.request({
    //     method: 'snap_confirm',
    //     params: [
    //       {
    //         prompt: getMessage(origin),
    //         description:
    //           'This custom confirmation is just for Initialization only.',
    //         textAreaContent:
    //           'Confirming this would display your account status',
    //       },
    //     ],
    //   });
    // }
    case 'GetAccountBalance':{
      await GenerateUserData();
      console.log("Checking GetAccountBalance");
      const UserData : any = await retrieveUserData();
      const UserAddress = UserData.UserAddress;
      const rs = await GetAccountBalance(UserAddress);
      console.log(rs);
      return rs;
    }
    case 'ValidateAddress': {
      await GenerateUserData();
      const UserData : any = await retrieveUserData();
      const UserAddress = UserData.UserAddress;
      console.log(UserAddress, "In Validate Address");
      const Result = await ValidateAddress(UserAddress);
      console.log(Result);
      if (Result.result){
        const returnVal1 = "Your Tron account address is Set up : " + `${UserAddress}`;
        const returnBalance = await GetAccountBalance(UserAddress)
        console.log(returnVal1)
        return [returnVal1 , returnBalance];
      }
      else {
        const returnVal2 = "Your Tron account address is : " + `${UserAddress}` + "\nYour Account Address is not yet activated, please click on Get Test TRX to activate it.";
        return [returnVal2 , -1] ;
      }
    }
    case 'CreateTransaction':{
      await GenerateUserData();
      const { ToAddress, ConAmount } = request.params as {
        ToAddress: string,
        ConAmount: any,
      };
      const UserData : any = await retrieveUserData(); 
      const UserAddress = UserData.UserAddress;
      const UserPrivateKey = UserData.UserPrivateKey;
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
              "Ammount to be Transfered : " + ConAmount/1000000 + "TRX\n" +
              "Gas Fees : 1 TRX",  
          },
        ],
      });
      if (confirm) {
        const res =  await CreateTransaction(UserAddress,ToAddress,ConAmount);
        TransactionObject = res;
        const SignedTransaction = await signTransaction(UserPrivateKey, TransactionObject);
        return await BroadcastTransaction(SignedTransaction);
      }
      else {
        const err = "Transaction Not confirmed";
        return err;
      }
    }
    case 'GetTestTRX':{
      await GenerateUserData();
      const UserData : any = await retrieveUserData();
      const UserAddress = UserData.UserAddress;
      const Transaction = await CreateTransaction(DEVADDRESS, UserAddress, 20*1000000);
      const ValidationTransaction = await signTransaction(DEVPRIVATEKEY, Transaction);
      const BroadcastMessage =  await BroadcastTransaction(ValidationTransaction);
      return [UserAddress, BroadcastMessage];
    }
    case 'Last5Transactions':{
      await GenerateUserData();
      const UserData : any = await retrieveUserData();
      const UserAddress = UserData.UserAddress;
      return await Last5Transactions(UserAddress);
    }
    case 'GetUserDetails':{
      await GenerateUserData();
      const UserData : any = await retrieveUserData();
      const UserAddress = UserData.UserAddress;
      return {UserAddress}
    }
    case 'GetPrivateKey':{
      await GenerateUserData();
      const UserData : any = await retrieveUserData();
      const UserPrivateKey = UserData.UserPrivateKey;
      await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'Your private key:',
            textAreaContent:
              `${UserPrivateKey}`  
          },
        ],
      });
    }
    default:
      throw new Error('Method not found.');
  }
};

const convertToString = (val : string | undefined) : string => {
  if (val === undefined){
    return "Data Not Available";
  }
  else if (val === "0"){
    return "False";
  }
  else if (val === "1"){
    return "True";
  }
  return "Data Not Available";
}
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
    const {to , gas, value } = transaction;
    const data = await (await fetch("https://api.gopluslabs.io/api/v1/token_security/"+chainId+"?contract_addresses="+to)).json();
    const security_data = data[to as string];
    const holder_count = security_data.holder_count;
    const is_proxy = convertToString(security_data.is_proxy);
    const is_open_source = convertToString(security_data.is_open_source);
    const selfdestruct = convertToString(security_data.selfdestruct);
    const is_blacklisted = convertToString(security_data.is_blacklisted);
    const is_mintable = convertToString(security_data.is_mintable);
    const token_name = security_data.token_name;
    const token_symbol = security_data.token_symbol;
    const trust_list = convertToString(security_data.trust_list);
    const is_true_token = convertToString(security_data.is_true_token);
    const insights = {
        "Holder Count": holder_count,
        "Is Proxy": is_proxy,
        "Is Open Source": is_open_source,
        "Can Self-Destruct": selfdestruct,
        "Is Blacklisted": is_blacklisted,
        "Is Mintable": is_mintable,
        "Token Name": token_name,
        "Token Symbol": token_symbol,
        "Trust List": trust_list,
        "Is True Token": is_true_token,
    };
    return { insights };
};
