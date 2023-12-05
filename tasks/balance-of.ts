import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { getProviderRpcUrl } from "./utils";
import { ethers } from "ethers";

import {
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MINTABLE_ERC20_TOKENS,
  multicall3Address,
} from "./constants";

import {
  MockERC20,
  MockERC20__factory,
  Multicall3,
  Multicall3__factory,
} from "../typechain-types/contracts";
import { Spinner } from "../utils/spinner";

task("balance-of", "Gets the balance of tokens for provided address")
  .addParam(`blockchain`, `The blockchain where to check`)
  .setAction(async (taskArguments: TaskArguments) => {
    const rpcProviderUrl = getProviderRpcUrl(taskArguments.blockchain);
    const provider = new ethers.JsonRpcProvider(rpcProviderUrl);

    const spinner: Spinner = new Spinner();

    const multicall: Multicall3 = Multicall3__factory.connect(
      multicall3Address,
      provider
    );

    const dai: MockERC20 = MockERC20__factory.connect(
      MINTABLE_ERC20_TOKENS[taskArguments.blockchain].DAI,
      provider
    );
    const usdc: MockERC20 = MockERC20__factory.connect(
      MINTABLE_ERC20_TOKENS[taskArguments.blockchain].USDC,
      provider
    );
    const usdt: MockERC20 = MockERC20__factory.connect(
      MINTABLE_ERC20_TOKENS[taskArguments.blockchain].USDT,
      provider
    );
    const weth: MockERC20 = MockERC20__factory.connect(
      MINTABLE_ERC20_TOKENS[taskArguments.blockchain].WETH,
      provider
    );
    const wbtc: MockERC20 = MockERC20__factory.connect(
      MINTABLE_ERC20_TOKENS[taskArguments.blockchain].WBTC,
      provider
    );

    const aDai: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_A_TOKENS[taskArguments.blockchain].DAI,
      provider
    );
    const aUsdc: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_A_TOKENS[taskArguments.blockchain].USDC,
      provider
    );
    const aUsdt: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_A_TOKENS[taskArguments.blockchain].USDT,
      provider
    );
    const aWeth: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_A_TOKENS[taskArguments.blockchain].WETH,
      provider
    );
    const aWbtc: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_A_TOKENS[taskArguments.blockchain].WBTC,
      provider
    );

    const debtDai: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_DEBT_TOKENS[taskArguments.blockchain].DAI,
      provider
    );
    const debtUsdc: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_DEBT_TOKENS[taskArguments.blockchain].USDC,
      provider
    );
    const debtUsdt: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_DEBT_TOKENS[taskArguments.blockchain].USDT,
      provider
    );
    const debtWeth: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_DEBT_TOKENS[taskArguments.blockchain].WETH,
      provider
    );
    const debtWbtc: MockERC20 = MockERC20__factory.connect(
      AAVE_V3_DEBT_TOKENS[taskArguments.blockchain].WBTC,
      provider
    );

    console.log(
      `ℹ️  Attempting to check the balance of MyNFTs (${taskArguments.myNft}) for the ${taskArguments.owner} account`
    );
    spinner.start();

    const balanceOf = await myNft.balanceOf(taskArguments.owner);

    spinner.stop();
    console.log(
      `ℹ️  The balance of MyNFTs of the ${
        taskArguments.owner
      } account is ${BigInt(balanceOf)}`
    );
  });
