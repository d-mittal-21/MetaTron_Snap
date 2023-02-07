import { useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { defaultSnapOrigin } from '../config';
import {
  connectSnap,
  getSnap,
  sendHello,
  getUserPvtKey,
  sendNewAccount,
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
  SendAccountBalanceButton,
  SendNewAccountButton,
  Card,
  Card2,
} from '../components';
import '../utils/transactionForm.css';

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
  margin-left: 0%;
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

const Notice6 = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;

  width: 80%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const Notice3 = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.8rem;
  margin-top: 1.4rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    // padding: 1.6rem;
  }
`;


const Notice2 = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: .8rem;
  margin-top: 2.4rem;
  width: 16%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    // padding: 1.6rem;
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
  const [num2, setNum2] = useState(-2);
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
      console.log("Here!");
      handleSendHelloClick();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
      const [msg, balance] = await sendValidateAddress();
      if (balance != -1) {
        const ListTransaction: any = await sendLastTransactions();
        console.log("Listing Transactions");
        console.log(ListTransaction);
        setArray(ListTransaction);
        setNum2(balance);
      }
      console.log(msg);
      setStr(msg);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetUserPvtKey = async () => {
    try {
      await getUserPvtKey();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendTransactionClick = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response: any = window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'CreateTransaction',
            params: {
              ToAddress: inputAddress,
              ConAmount: inputAmount * 1000000,
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
        Welcome to <Span>MetaTron</Span>
      </Heading>
      <Subtitle>
        Get started by using different functions available for making transactions
      </Subtitle>
      <Notice>
        {str && <p>{str}</p>}
        {(num2!=-2 && num2 !=-1)&& <p>Your Balance : {num2} TRX</p>}
      </Notice>
      <div>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        <div
          style={{
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "space-between",
            "gap": "100px",
            "marginTop": "30px"
          }}
        >
          <div
            style={{
              "display": "grid",
              "gridTemplateColumns": "auto auto"
            }}
          >
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
                      onClick={handleConnectClick}
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
            <Card2
              content={{
                title: 'Refresh',
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
                title: 'Get Test TRX',
                description:
                  'Get Shasta Testnet TRX to activate your account or testing the dapp',
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
                title: 'Get Private Key',
                description:
                  'Display your private key in MetaMask',
                button: (
                  <SendAccountBalanceButton
                    onClick={handleGetUserPvtKey}
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

          <div>
            <div>
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
            </div>
          </div>
        </div>

        <Notice2>
          <p style={{ "textAlign": "center", "fontWeight": "bold", "fontSize": 18 }}>Last 5 Transactions</p>
        </Notice2>

        <div>
          <Notice3>
            <table>
              <thead>
                <tr key={6}>
                  <th style={{ "fontWeight": "bold", "fontSize": 18, "minWidth": 325, "textAlign": "left" }}>From</th>
                  <th style={{ "fontWeight": "bold", "fontSize": 18, "minWidth": 325, "textAlign": "left" }}>To</th>
                  <th style={{ "fontWeight": "bold", "fontSize": 18, "minWidth": 270, "textAlign": "left" }}>Hash</th>
                  <th style={{ "fontWeight": "bold", "fontSize": 18, "textAlign": "left" }}>Amount</th>
                  <th style={{ "fontWeight": "bold", "fontSize": 18, "minWidth": 50, "textAlign": "right" }}>Fee</th>
                </tr>
              </thead>
              <tbody>
                {
                  trArray ? trArray.map((tr: any, key: any) => {
                    return <tr key={key}>
                      <th style={{ "fontWeight": "normal", "fontSize": 14, "textAlign": "left" }}>{tr.ownerAddress}</th>
                      <th style={{ "fontWeight": "normal", "fontSize": 14, "textAlign": "left" }}>{tr.toAddress}</th>
                      <th style={{ "textAlign": "left", "fontSize": 14 }}><a style={{ "fontWeight": "normal", "color": "#D6D9DC" }} href={"https://shasta.tronscan.org/#/transaction/" + tr.hash}>{tr.hash.substr(1, 13)}.......{tr.hash.substr(-13)}</a></th>
                      <th style={{ "fontWeight": "normal", "fontSize": 14, "textAlign": "right" }}>{tr.amount / 1000000}</th>
                      <th style={{ "fontWeight": "normal", "fontSize": 14, "textAlign": "right" }}>{tr.fee}</th>
                    </tr>
                  }) :
                    "No Transaction Record"
                }
              </tbody>
            </table>
          </Notice3>
        </div>

        {/* <TableContainer sx={{ margin: 1 }} component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow >
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 14 }} align="left">From Address</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 14 }} align="left">To Address</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 14 }} align="left">Hash&nbsp;(link)</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 14 }} align="right">Amount&nbsp;(Trx)</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold', fontSize: 14 }} align="right">Fee&nbsp;(Trx)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trArray.map((tr: any, key: any) => (
                <StyledTableRow key={key}>
                  <StyledTableCell component="th" scope="row" align="left">
                    {tr.ownerAddress}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="left">{tr.toAddress}</StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="left"><a href={"https://shasta.tronscan.org/#/transaction/" + tr.hash}>{tr.hash}</a></StyledTableCell>
                  <StyledTableCell align="right">{tr.amount / 1000000}</StyledTableCell>
                  <StyledTableCell align="right">{tr.fee}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}

        {/* <div style={{"alignItems": "center"}}>
          <Notice >
            <p>
              Please note that the <b>snap.manifest.json</b> and{' '}
              <b>package.json</b> must be located in the server root directory and
              the bundle must be hosted at the location specified by the location
              field.
            </p>
          </Notice>
        </div> */}

      </div>
    </Container>
  );

};

export default Index;
