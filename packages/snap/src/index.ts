import { OnRpcRequestHandler } from '@metamask/snap-types';
import { SLIP10Node } from '@metamask/key-tree';
import { fetchUrl } from './insights';
import { TransactionObject } from './types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */

const TronNode = await wallet.request({
  method: 'snap_getBip32Entropy',
  params: {
    // Must be specified exactly in the manifest
    path: ['m', "44'", "3'"],
    curve: 'secp256k1',
  },
});

const TronSlip10Node = await SLIP10Node.fromJSON(TronNode); //calling slip node for Tron

const UserPrivateKey = await TronSlip10Node.derive(["bip32:3'"]); //Now we have the users private key, 4th index is Private key

const Url = "https://api.shasta.trongrid.io/wallet/easytransferbyprivate" // tron api for EasyTransferByPrivate

const options = {
  method: 'POST',
  headers: {'TRON-PRO-API-KEY': '776e6fc0-3a68-4c6a-8ce5-fbc5213c60f7', accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({UserPrivateKey: UserPrivateKey, toAddress: 'string', amount: 0})
};

const GetLatestBlock = async () => {
  const data = await fetch('https://api.shasta.trongrid.io/wallet/getnowblock')
  return data.block
}

const TransferTron = async () => {
  const response  =  await fetch('https://api.shasta.trongrid.io/wallet/easytransferbyprivate', options)
  
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
    case 'TransferTron' :
      
    default:
      throw new Error('Method not found.');
  }
};
