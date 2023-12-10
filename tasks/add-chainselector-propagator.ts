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
} from "./constants";
import { Deployer } from "./utils";
task(
  `add-chainselector-propagator`,
  `Adds propagator from other chains to each mainnet`
).setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const chainSelectors = [
      "16015286601757825753",
      "12532609583862916517",
      "14767482510784806043",
    ];
    const propagators = [
      "0xabcE183A0721Ea13a2a68a0DDfc67125f9826f58",
      "0xA921C025b4527F859E6e33e6663B52B6e9D6201c",
      "0x26d71fA254D8BB0092dA7F22e290F078c19f7A98",
    ];
    leveragerAddress[hre.network.name];

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
