import { useContext , useState} from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { defaultSnapOrigin } from '../config';
import {
  connectSnap,
  getSnap,
  sendHello,
  sendAccountBalance,
  sendBroadcast,
  sendNewAccount,
  sendTransaction,
  sendTransactionSign,
  shouldDisplayReconnectButton,
  sendValidateAddress,
  sendLastTransactions,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  SendTransactionButton,
  SendTransactionSignButton,
  SendAccountBalanceButton,
  SendNewAccountButton,
  SendBroadcastButton,
  Card,
  Card2,
} from '../components';
import '../utils/transactionForm.css'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.large} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;
const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const input2 = styled.input`
 margin-right: 2;
`;


const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const Subtitle2 = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 15;
  margin-bottom: 0;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
  outline: 2px solid grey;
`;

const Subtitle3 = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 2;
  margin-bottom: 0;
  margin-right: 20%;
  margin-left: 25%;
  border-radius: 15pt;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
  outline: 2px solid grey;
`;

const Subtitle4 = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 2;
  margin-bottom: 0;
  margin-right: 20%;
  margin-left: -50%;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
  outline: 1px solid grey;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;



const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [num, setNum] = useState();
  const [num2, setNum2] = useState();
  const [str, setStr] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState(Number);
  const [trArray, setArray] = useState([]);
  // const [string, setString] = useState<string | undefined>();

  //function for handling changes in the inputs
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value);
  };
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amt = Number(event.target.value)
    setInputAmount(amt);
  };
  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();
      

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
      const [result, balance2] = await sendValidateAddress();
      if(result) {
        const ListTransaction : any = await sendLastTransactions();
        console.log("Listing Transactions");
        console.log(ListTransaction);
        setArray(ListTransaction);
      }
      console.log(23444);
      console.log(result);
      setStr(result);
      setNum2(balance2);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendAccountBalanceClick = async () => {
    try {
      const balance = await sendAccountBalance();
      console.log(balance);
      setNum2(balance)
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendValidateAddressClick = async () => {
    try {
      const result: string = await sendValidateAddress();
      console.log(result);
      setStr(result);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendTransactionClick = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response : any = window.ethereum.request({
        method: 'wallet_invokeSnap',
        params:  [
          defaultSnapOrigin,
          {
            method: 'CreateTransaction',
            params: {
              ToAddress : inputAddress,
              ConAmount : inputAmount*1000,
            }
          },
        ],
      })
      console.log(response)
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  const handleSendTransactionSignClick = async () => {
    try {
      await sendTransactionSign();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendBroadcastClick = async () => {
    try {
      await sendBroadcast();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendNewAccountClick = async () => {
    try {
      await sendNewAccount();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Tron Metamask Integration</Span>
      </Heading>
      <Subtitle>
        Get started by using different functions available for making transactions
      </Subtitle>
      <Notice>
        {str && <p>{str}</p>}
        {num2 && <p>Your Balance : {num2}</p>}
      </Notice>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
        <Card
          content={{
            title: 'Reconnect',
            description:
              'Connect to the Metamask Snap',
            button: (
              <ReconnectButton
                onClick= {handleConnectClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        )}
        <Card
          content={{
            title: 'Initialize',
            description:
              'Update Account status',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'New Account',
            description:
              'Generate your new account on TRON network',
            button: (
              <SendNewAccountButton
                onClick={handleSendNewAccountClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card2
          content={{
            title: 'Get Current Acount Balance',
            description:
              'Display your balance in account',
            button: (
              <SendAccountBalanceButton
                onClick={handleSendAccountBalanceClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <div>
          {num && <Subtitle3>Your Current Balance: {num}</Subtitle3>}
          {/* {string && <div>{string}</div>} */}
        </div>
        {/* <form onSubmit={handleSendTransactionClick}>
          <Card
            content={{
              title: 'Make a Transaction',
              description:
                'Transfer your Tron Token to another account',
              button: (
                <SendTransactionButton
                  onClick={handleSendTransactionClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
         <Subtitle3><form>
          Reciever Address : <input type="text" value={inputAddress} onChange={handleInputChange} />
          Amount : <input value={inputAmount} onChange={handleInputChange2} />
            </form></Subtitle3> 
          
          </form> */}

      <Subtitle3>  
          <div className="form1">
      <div className="title1">Make Transaction</div>
      <div className="subtitle5">Transfer your tron to a different Account</div>
      <div className="input-container1 ic1">
        <input type="text" value={inputAddress} onChange={handleInputChange} id="firstname" className="input1" placeholder=" " />
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder1">Reciever's Address</label>
      </div>
      <div className="input-container1 ic2">
        <input value={inputAmount} onChange={handleInputChange2} id="lastname" className="input1" placeholder=" " type="text" />
        <div className="cut"></div>
        <label htmlFor="lastname" className="placeholder1">Amount</label>
      </div>
      <div className="input-container1 ic2">
        <input id="email" className="input1" type="text" placeholder=" " />
        <div className="cut cut-short"></div>
        <label htmlFor="email" className="placeholder1">Tags</label>
      </div>
      <SendTransactionButton
                  onClick={handleSendTransactionClick}
                  disabled={!state.installedSnap}
                />
  </div>
  </Subtitle3>

          <Subtitle4>
            <table>
              <thead>
                  <tr key={6}>
                    <th>From</th>
                    <th>To</th>
                    <th>Hash</th>
                    <th>Amount</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      trArray?trArray.map((tr : any,key : any)=>{
                        return <tr key={key}>
                          <th>{tr.ownerAddress}</th>
                          <th>{tr.toAddress}</th>
                          <th>{tr.hash}</th>
                          <th>{tr.amount/1000000}</th>
                          <th>{tr.Fee}</th>
                        </tr>
                      }):
                      "No Transaction Record" 
                    }
                  </tbody>
                </table>
          </Subtitle4>
  

        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );

};

export default Index;
