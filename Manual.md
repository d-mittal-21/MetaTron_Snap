# MetaTron Snap
Snap to enable MetaMask users interaction with the Tron Blockchain.  

To start the snap
```bash
nvm use
yarn 
yarn start
```
The snap will be hosted at https://localhost:8080/.  
The frontend of the snap will be hosted at https://localhost:8000/.

Note: All transactions are carried out on the shasta testnet provided by Tron.

The snap provides the following functionalities to the user:  

- Creating a new account
- Showing current balance
- Sending TRX to another account
- View last 5 transactions done by the user

After connecting to the snap, the user have to click on the Initialize button to load his Account Status. His/Her account will be displayed at the top if the user already has an account address, otherwise the user can click on Create Account to have an account address with 20 test TRX initialized.

The snap exposes the following methods to the dapp:  

- `GetAccountBalance` :  Get the accout balance of the user.
- `ValidateAddress` : Check whether the address is valid (i.e if it already exists on the blockchain).
- `Last5Transactions`: Get details of the last 5 transactions done by the user.
- `GetUserDetails` : Get the Tron address of the user
- `CreateTransaction`: Execute a transaction on the Tron Blockchain
    - `params` : `ToAddress` , `Amount`
- `GetPrivateKey` : Show the private key of Tron Account to the user in MetaMask.
