import { PayFeesIn, routerConfig } from "./constants";

import { AbiCoder, ParamType, getCreate2Address, keccak256 } from "ethers";
import {
  Create2DeployerLocal__factory,
  Create2DeployerLocal,
} from "../typechain";
import { Wallet, JsonRpcProvider } from "ethers";

export const getProviderRpcUrl = (network: string) => {
  let rpcUrl;

  switch (network) {
    case "ethereumSepolia":
      rpcUrl = process.env.ETHEREUM_SEPOLIA_RPC_URL;
      break;
    case "optimismGoerli":
      rpcUrl = process.env.OPTIMISM_GOERLI_RPC_URL;
      break;
    case "arbitrumTestnet":
      rpcUrl = process.env.ARBITRUM_TESTNET_RPC_URL;
      break;
    case "avalancheFuji":
      rpcUrl = process.env.AVALANCHE_FUJI_RPC_URL;
      break;
    case "polygonMumbai":
      rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
      break;
    default:
      throw new Error("Unknown network: " + network);
  }

  if (!rpcUrl)
    throw new Error(
      `rpcUrl empty for network ${network} - check your environment variables`
    );

  return rpcUrl;
};

export const getPrivateKey = () => {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables"
    );

  return privateKey;
};

export const getRouterConfig = (network: string) => {
  switch (network) {
    case "ethereumSepolia":
      return routerConfig.ethereumSepolia;
    case "optimismGoerli":
      return routerConfig.optimismGoerli;
    case "arbitrumTestnet":
      return routerConfig.arbitrumTestnet;
    case "avalancheFuji":
      return routerConfig.avalancheFuji;
    case "polygonMumbai":
      return routerConfig.polygonMumbai;
    default:
      throw new Error("Unknown network: " + network);
  }
};

export const getPayFeesIn = (payFeesIn: string) => {
  let fees;

  switch (payFeesIn) {
    case "Native":
      fees = PayFeesIn.Native;
      break;
    case "native":
      fees = PayFeesIn.Native;
      break;
    case "LINK":
      fees = PayFeesIn.LINK;
      break;
    case "link":
      fees = PayFeesIn.LINK;
      break;
    default:
      fees = PayFeesIn.Native;
      break;
  }

  return fees;
};

export class Deployer {
  public encoder;
  public create2Address;
  public wallet: Wallet;
  public factoryAddress: string;

  constructor(_wallet: Wallet, _provider: JsonRpcProvider, factory: string) {
    this.wallet = _wallet.connect(_provider);
    this.factoryAddress = factory;

    this.encoder = (
      types: readonly (string | ParamType)[],
      values: readonly any[]
    ) => {
      const encodeParams = new AbiCoder().encode(types, values);
      return encodeParams.slice(2);
    };
    this.create2Address = (saltHex: string, initCode: string) => {
      const create2Addr: string = getCreate2Address(
        this.factoryAddress,
        saltHex,
        keccak256(initCode)
      );
      return create2Addr;
    };
  }

  async deploy(this: any, salt: string, initCode: string) {
    const create2Addr: string = this.create2Address(salt, initCode);
    console.log("precomputed address: ", create2Addr);

    const create2Factory: Create2DeployerLocal =
      Create2DeployerLocal__factory.connect(this.factoryAddress, this.wallet);
    const tx = await create2Factory.deploy(0, salt, initCode);
    await tx.wait();

    console.log("deployed address: ", create2Addr);
  }
}
