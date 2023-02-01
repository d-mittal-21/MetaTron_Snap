import { OnRpcRequestHandler } from '@metamask/snap-types';
import { SLIP10Node } from '@metamask/key-tree';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { fetchUrl } from './insights';
const TronWeb = require('tronweb');

const APIKEY = '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7';
const HEADER: any = { 'TRON-PRO-API-KEY': `${APIKEY}`, accept: 'application/json', 'content-type': 'application/json' }

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */


const Amount: any = 5;
const DevAddress = 'TCmj2ALymCKAANLNYLrdu6r4rf9Qw8fGRL';
const Url = "https://api.shasta.trongrid.io/wallet/easytransferbyprivate" // tron api for EasyTransferByPrivate

const TronNode = await wallet.request({
  method: 'snap_getBip32Entropy',
  params: {
    // Must be specified exactly in the manifest
    path: ['m', "44'", "195'"],
    curve: 'secp256k1',
  },
});

const TronSlip10Node = await SLIP10Node.fromJSON(TronNode);
const PrivateKey = await TronSlip10Node.derive(["bip32:3'"]);
const PublicKey = await TronSlip10Node.derive(["bip32:4"]);

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { "TRON-PRO-API-KEY": APIKEY },
  privateKey: PrivateKey
})

const GetNewAddressHash = async () => {
  var hash = tronWeb.sha3(PublicKey);
  hash = hash.slice(-20);
  let hexHash = '';
  for (let i = 0; i < str.length; i++) {
    hexHash += str.charCodeAt(i).toString(16);
  }
  hexHash = '0x41' + hexHash;
  var hashOfHash = tronWeb.sha3(hexHash,{encoding:'hex'})
  hashOfHash = tronWeb.sha3(hexHash,{encoding:'hex'})
  const verificationCode = hashofHash.slice(4)
} 

// const options = {
//   method: 'POST',
//   headers: {'TRON-PRO-API-KEY': '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7', accept: 'application/json', 'content-type': 'application/json'},
//   body: JSON.stringify({UserPrivateKey: PrivateKey, toAddress: 'string', amount: 0})
// };

const GetLatestBlock = async () => {
  const data: any = await fetch('https://api.shasta.trongrid.io/wallet/getnowblock');
  return { blockID: data.blockID, number: data.block_header.raw_data.number }
}

const GetAccountBalance = async (OwnerAddress : string) => {
  const [Hash, Number]: any = await GetLatestBlock();
  const AccountBalance = await fetch('https://api.shasta.trongrid.io/wallet/getaccountbalance', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      account_identifier: `{"address": ${OwnerAddress}},`,
      block_identifier: {
        hash: Hash,
        number: Number
      },
      visible: true
    })
  });
  return { AccountBalance };
}

const CreateTransaction = async (OwnerAddress: string, ToAddress: string, Amount: Number) => {
  const TransactionObject = await fetch('https://api.shasta.trongrid.io/wallet/createtransaction', {
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
  });
  return { TransactionObject };
}

const GetTransactionSign = async (TransactionObject: any, PrivateKey: string) => {
  const TransactionSign = await fetch('https://api.shasta.trongrid.io/wallet/gettransactionsign', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      transaction: {
        raw_data: TransactionObject.raw_data,
        raw_data_hex: TransactionObject.txID
      },
      privateKey: PrivateKey
    })
  });

  return { TransactionSign };
}

const BroadcastTransaction = async () => {
  const BroadcastResult = await fetch('https://api.shasta.trongrid.io/wallet/broadcasttransaction', {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      raw_data: '{"contract":[{"parameter":{"value":{"amount":1000,"owner_address":"41608f8da72479edc7dd921e4c30bb7e7cddbe722e","to_address":"41e9d79cc47518930bc322d9bf7cddd260a0260a8d"},"type_url":"type.googleapis.com/protocol.TransferContract"},"type":"TransferContract"}],"ref_block_bytes":"5e4b","ref_block_hash":"47c9dc89341b300d","expiration":1591089627000,"timestamp":1591089567635}',
      raw_data_hex: '0a025e4b220847c9dc89341b300d40f8fed3a2a72e5a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a1541608f8da72479edc7dd921e4c30bb7e7cddbe722e121541e9d79cc47518930bc322d9bf7cddd260a0260a8d18e8077093afd0a2a72e'
    })
  });
}

const generateAccount = async () => {
  const TronNode = await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      // Must be specified exactly in the manifest
      path: ['m', "44'", "195'"],
      curve: 'secp256k1',
    },
  });
}
const createNewAccount = async (AccountAddress: string) => {
  const url = "https://api.shasta.trongrid.io/wallet/createaccount";
  const options = {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({
      owner_address: `${DevAddress}`,
      account_address: `${AccountAddress}`
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

export const getMessage = (originString: string): string =>
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
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
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
      return GetAccountBalance(DevAddress);

    case 'CreateTransaction':
      const { ToAddress } = request.params as {
        ToAddress: string
      };
      return CreateTransaction(DevAddress,ToAddress, Amount);

    case 'SignTransaction':``
      return GetTransactionSign(CreateTransaction(DevAddress, DevAddress, Amount), PrivateKey);

    case 'BroadcastTransaction':
      return BroadcastTransaction();

    case 'createNewAccount':
      return {};

    default:
      throw new Error('Method not found.');
  }
};
