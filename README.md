# polygon-books-hardhat

A simple project to learn more about developing smart contract on polygon.

## Local Development Environment Setup

Install all required dependencies using NPM: `npm install`

### Configure MetaMask to connect to the Polygon Mumbai Testnet

Setting up MetaMask to connect to the Polygon Mumbai Testnet is useful for a few reasons:

- It makes it easy to interact with faucets, to obtain testnet MATIC and LINK
- Once the contract is verified on PolygonScan, it will make it easy to invoke functions
  exposed by your smart contract.

For security purposes, it's highly recommended to setup a **fresh** MetaMask account.
This is because we'll be exporting the private key of your MetaMask wallet once connected
to the testnet, this private key will be identical to the private key for your mainnet wallet.
If your MetaMask account is holding any cryptocurrency, you don't want to risk leaking
your private key, which a bad actor could use to access your funds!

Before creating a brand new MetaMask account, ensure you securely store your seed phrase, which
you will need if you ever want to restore your old account.

Navigate [here](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)
and select `Mumbai-Testnet` and follow the instructions to add the `Mumbai-Testnet` to MetaMask.

Follow [these instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)
to export your account's private key.

Populate your private key in your `.env` file (PRIVATE_KEY).

### Obtain some testnet MATIC and LINK

To deploy to the Polygon testnet you will need some MATIC tokens on the testnet.
The smart contract in this project makes use of the [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/),
making use of the Chainlink VRF will cost LINK, which is why you will need some LINK tokens on
the testnet.

Visit [this polygon faucet](https://faucet.polygon.technology/) to request LINK and MATIC testnet tokens.

Once the tokens arrive, they should be visible in your MetaMask account.

### Obtain a PolygonScan API key

To update token information on PolygonScan, the token contract address must be verified.
The process of verification ensures the contract code is exactly what is being deployed to
the blockchain, and also allows the public to audit and read the contract.

PolygonScan ensures that, before a contract can be updated with information submitted by
the contract owner, the contract must first be verified.

Sign up for an account on [PolygonScan](https://polygonscan.com/).

Once signed up, navigate to your account and obtain an API Key.

Populate your API key in your `.env` file (POLYGONSCAN_API_KEY).

Once this is done, you'll be easily able to verify your contract using the `npx hardhat verify` command.

## Deploying the smart contract

When deploying our smart contract, we may deploy to our local blockchain, or to the polygon testnet.

### Deployment to a local blockchain

To deploy the contract locally, simply execute:

```bash
npx hardhat deploy
```

This will compile and deploy the smart contract to your local `hardhat` network.
The local `hardhat` network is an in-process local blockchain, an ephemeral ethereum
network that is created and destroyed with the process.
It has no memory (i.e each time you run a deployment like this, a fresh network is
started up) and is destroyed after the deployment. This means we won't be able to
interact with our smart contract after this command is done executing. The `hardhat`
network is very quick, and good for running tests and checking if our contracts deploy
successfully, but if one wants to actually interact with the deployed contract, its better
to deploy to the `localhost` network (not to be confused with the `hardhat` network!).

Executing the command to spin up a local node will automatically run the deployment scripts
in the `deployments` folder, so we won't have to execute a `npx hardhat deploy`.

This spin up a local node, execute:

```bash
# optionally supply the `no-deploy` flag to prevent any deployments from executing
npx hardhat node --network localhost
```

To manually deploy to this local node, in another terminal, execute:

```bash
npx hardhat deploy --network localhost
```

At this point, if you check in on your node, you'll see some logs indicating that the contract was
deployed. You can now interact with your contract using the hardhat console:

```
npx hardhat console --network localhost

// You can retrieve the address of your contract by inspecting the deployment or node logs.
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

// retrieve an instance of our deployed contract we can interact with
const contract = await ethers.getContractAt("CryptoBooks", contractAddress);

// Retrieve how many tokens (minted by the contract) belong to the given address
balance = await contract.balanceOf('<address_here>');
```

TODO: Document mocking of Chainlink VRF Coordinator and Link Token in local environments

### Deployment to a remote blockchain (testnet)

Before deploying to the testnet, ensure you have some testnet MATIC; since we are modifying
the state of the polygon testnet, we will need to spend some testnet MATIC.

Note that the account deploying this contract will be the one corresponding to your private
key stored in your `.env` file.

To deploy to the testnet execute:

```
npx hardhat deploy --network polygon_testnet
```

You're now free to interact with the contract as described in `Deployment to a local blockchain` by spinning up a hardhat console:

```
npx hardhat console --network polygon_testnet
```

#### Verifying our contract

If we want to be able to browse the source code of our contract on PolygonScan (and not just view the bytecode) we will
need to verify the contract using PolygonScan's API. Doing so will also let us interact with all of our contract's functions
via MetaMask.

**Note:** Do note what is mentioned in the previous section, there is a bug with HardHat and the polygon testnet, so ensure you
retrieve the correct contract address for verification.

To verify the contract, execute the following command:

```
npx hardhat verify --network polygon_testnet <contract address> <... parameters provided to contract constructor at deploy time>
```

For example, to verify the contract in this repository you would execute:

```
npx hardhat verify --network polygon_testnet <contract address> 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255 0x326C977E6efc84E512bB9C30f76E30c160eD06FB 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
```

TODO: This verification process should be easily automatable (prevent having to provide parameters manually)

TODO: Document test execution and mock configuration
