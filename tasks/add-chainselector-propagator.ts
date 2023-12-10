import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, ethers, id } from "ethers";
import { Spinner } from "../utils/spinner";

import { Leverager__factory } from "../typechain-types";
import {
  LINK_ADDRESSES,
  create2DeployerAddress,
  WETH_ADDRESSES,
  LENDING_POOLS,
  leveragerAddress,
  propagatorAddress,
  routerConfig,
} from "./constants";
import { Deployer } from "./utils";
task(
  `add-chainselector-propagator`,
  `Adds propagator from other chains to each mainnet`
).setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const chains = ["ethereumSepolia", "polygonMumbai", "avalancheFuji"];
    const chainSelectors = [];
    const propagators = [];
    for (const chain of chains) {
      chainSelectors.push(routerConfig[chain].chainSelector);
      propagators.push(propagatorAddress[chain]);
    }
    const privateKey = getPrivateKey();
    const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

    const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(provider);

    const leverager = Leverager__factory.connect(
      leveragerAddress[hre.network.name],
      signer
    );

    await leverager.addDstChainPropagators(chainSelectors, propagators);

    console.log(`✅ on the ${hre.network.name} blockchain`);
  }
);
