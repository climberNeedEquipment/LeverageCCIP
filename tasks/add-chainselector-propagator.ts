import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, ethers, id } from "ethers";

import { Leverager__factory } from "../typechain-types";
import { leveragerAddress, propagatorAddress, routerConfig } from "./constants";
task(
  `add-chainselector-propagator`,
  `Adds propagator from other chains to each mainnet`
).setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const chains = ["ethereumSepolia", "polygonMumbai", "avalancheFuji"];
    const chainSelectors = [];
    const propagators = [];
    const leveragers = [];
    for (const chain of chains) {
      chainSelectors.push(routerConfig[chain].chainSelector);
      propagators.push(propagatorAddress[chain]);
      leveragers.push(leveragerAddress[chain]);
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
    console.log({ chainSelectors, propagators, leveragers });

    await leverager.addDstChainPropagatorsLeveragers(
      chainSelectors,
      propagators,
      leveragers
    );

    console.log(`✅ on the ${hre.network.name} blockchain`);
  }
);
