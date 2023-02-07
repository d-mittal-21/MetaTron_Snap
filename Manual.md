# MetaTron Snap
<!--- What the project is -->
Snap to enable MetaMask users interaction with the Tron Blockchain.  
<!--- ![image](https://user-images.githubusercontent.com/92073778/217269458-fc01c44a-b2aa-45f1-bf4a-67c319cf146e.png) -->

<!--- What it aims to accomplish -->
Tron is not an EVM compatible network, hence, can't be added to MetaMask directly.

The snap fulfills the following objectives :
- MetaMask users would be able to access Tron dApps without installing different wallets 
- Users would be able to leverage the awesome functionalities of MetaMask while working in Tron ecosystem

![image](https://user-images.githubusercontent.com/92073778/217269734-18fe4630-8748-444d-a77c-932e1ed86f76.png)
## Steps for running locally
To start the snap
```bash
nvm use
yarn 
yarn start
```
The snap will be hosted at https://localhost:8080/.  
The frontend of the snap will be hosted at https://localhost:8000/.

Note: All transactions are carried out on the shasta testnet provided by Tron.

![image](https://user-images.githubusercontent.com/92073778/217270442-243eb3fa-ce7d-4471-b955-1e9a820e9d43.png)  ![image](https://user-images.githubusercontent.com/92073778/217270745-647c6634-7406-4da5-b197-4f03c9a3b50d.png)

The snap provides the following functionalities to the user:  

- Creating a new account
- Showing current balance
- Sending TRX to another account
- View last 5 transactions done by the user

![image](https://user-images.githubusercontent.com/92073778/217273478-4d6af3a5-ac06-4627-b20e-62b617c16aca.png)

After connecting to the snap, the account status of the user will be displayed. 

The account will be displayed at the top if the user already has an account address, otherwise the user can click on Activate to have an account address with 20 test TRX initialized.

The snap exposes the following methods to the dapp:  

- `GetAccountBalance` :  Get the account balance of the user.
- `ValidateAddress` : Check whether the address is valid (i.e if it already exists on the blockchain).
- `Last5Transactions`: Get details of the last 5 transactions done by the user.
- `GetUserDetails` : Get the Tron address of the user
- `CreateTransaction`: Execute a transaction on the Tron Blockchain
    - `params` : `ToAddress` , `Amount`
- `GetPrivateKey` : Show the private key of Tron Account to the user in MetaMask.
