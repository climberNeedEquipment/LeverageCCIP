import {
  Leverager__factory,
  Leverager,
  ILeverager,
  IRouterClient,
  IPool__factory,
  IPool,
  MockERC20,
  MockERC20__factory,
  Client__factory,
  IRouterClient__factory,
} from "../typechain-types";

import { contractsCcip } from "../typechain-types/@chainlink";
import { resetFork } from "./utils";
import {
  MINTABLE_ERC20_TOKENS,
  AAVE_V3_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  MAX_UINT256,
  WETH_ADDRESSES,
  LINK_ADDRESSES,
  LENDING_POOLS,
  routerConfig,
  ETH_EE_ADDRESS,
} from "../tasks/constants";
import { getPrivateKey } from "../tasks/utils";
import { expect } from "chai";
import { AbiCoder, Wallet, ethers, parseEther, parseUnits } from "ethers";
import hre from "hardhat";
import { Client as RouterClient } from "../typechain-types/@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient";
import { Client } from "../typechain-types/@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver";
describe("Leverager", () => {
  let leverager: Leverager;
  let signer: any;
  let network: string;
  const ERC20: Record<string, MockERC20> = {};
  const aERC20: Record<string, MockERC20> = {};
  const cERC20: Record<string, MockERC20> = {};
  const debtERC20: Record<string, MockERC20> = {};

  beforeEach(async () => {
    network = process.env.network || "ethereumSepolia";
    console.log("network:", network);
    await resetFork(network);
    console.log("Fork done");

    const privateKey = getPrivateKey();
    const wallet = new Wallet(privateKey);

    signer = await hre.ethers.getSigner(wallet.address);
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [signer.address],
    });

    leverager = await (await hre.ethers.getContractFactory("Leverager"))
      .connect(signer)
      .deploy(
        signer.address,
        WETH_ADDRESSES[network],
        routerConfig[network].address,
        LINK_ADDRESSES[network],
        LENDING_POOLS[network].AaveV3LendingPool
      );

    const leverageAddress = await leverager.getAddress();

    console.log("Leverager deployed to:", leverageAddress);

    /// add destination chain propagator
    const propagator = await leverager.propagator();

    await leverager.addDstChainPropagatorsLeveragers(
      [routerConfig[network].chainSelector],
      [propagator],
      [leverageAddress]
    );

    for (const [tokenName, tokenAddress] of Object.entries(
      MINTABLE_ERC20_TOKENS[network]
    )) {
      /// take some tokens for the testings
      if (tokenName === "DAI" || tokenName === "WETH") {
        ERC20[tokenName] = MockERC20__factory.connect(tokenAddress, signer);
        /// approve underlying assets to leverager
        await ERC20[tokenName].approve(leverageAddress, MAX_UINT256);
      }
    }
    console.log("Approve to Leverager(ERC20) is finished", leverageAddress);

    for (const [tokenName, tokenAddress] of Object.entries(
      AAVE_V3_A_TOKENS[network]
    )) {
      if (tokenName === "DAI" || tokenName === "WETH") {
        aERC20[tokenName] = MockERC20__factory.connect(tokenAddress, signer);
        /// approve A assets to leverager
        await aERC20[tokenName].approve(leverageAddress, MAX_UINT256);
      }
    }

    console.log("Approve to Leverager(aToken) is finished", leverageAddress);

    for (const [tokenName, tokenAddress] of Object.entries(
      AAVE_V3_DEBT_TOKENS[network]
    )) {
      if (tokenName === "DAI" || tokenName === "WETH") {
        debtERC20[tokenName] = MockERC20__factory.connect(tokenAddress, signer);
        /// approve delegate debt assets to leverager

        await debtERC20[tokenName].approveDelegation(
          leverageAddress,
          MAX_UINT256
        );
      }
    }
    console.log("Approve to Leverager(debtToken) is finished", leverageAddress);
  });

  it("supplies DAI to AaveV3", async () => {
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    // either leverage or deleverage is fine
    // base

    let amount = parseUnits("1", "ether");
    const balance = await ERC20[token].balanceOf(signer.address);

    /// Vanilla Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: "0x",
    };
    leverager.connect(signer);

    const tx = await leverager.supply(params);

    const receipt = await tx.wait();
  });

  it("withdraw DAI from AaveV3", async () => {
    /// Supply before withdrawal
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    // either leverage or deleverage is fine
    // base

    let amount = parseUnits("1", "ether");

    /// Vanilla Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: "0x",
    };
    leverager.connect(signer);

    const tx = await leverager.supply(params);

    const receipt = await tx.wait();

    /// Withdraw
    amount = await aERC20[token].balanceOf(signer.address);
    flags = 0;
    flags += 1; // aave

    const tx2 = await leverager.withdraw(params);
    const receipt2 = await tx2.wait();
  });
  it("borrow DAI from AaveV3", async () => {
    /// Supply before borrow
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    // either leverage or deleverage is fine
    // base

    let amount = parseUnits("1", "ether");

    /// Vanilla Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: "0x",
    };
    leverager.connect(signer);

    const tx = await leverager.supply(params);
    /// Borrow
    amount = parseUnits("0.5", "ether");
    params.amount = amount;
    params.counterAsset = AAVE_V3_DEBT_TOKENS[network][token];

    console.log("before ", await ERC20[token].balanceOf(signer.address));
    console.log(
      "before debt",
      await debtERC20[token].balanceOf(signer.address)
    );
    const tx2 = await leverager.borrow(params);
    const receipt2 = await tx2.wait();

    console.log("after ", await ERC20[token].balanceOf(signer.address));
    console.log(
      "after debt ",
      await debtERC20[token].balanceOf(signer.address)
    );
  });

  it("Repay DAI from AaveV3", async () => {
    /// Supply before withdrawal
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    // either leverage or deleverage is fine
    // base

    let amount = parseUnits("1", "ether");

    /// Vanilla Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: "0x",
    };
    leverager.connect(signer);

    const tx = await leverager.supply(params);
    /// Borrow
    amount = parseUnits("0.5", "ether");
    params.amount = amount;
    params.counterAsset = AAVE_V3_DEBT_TOKENS[network][token];

    console.log("before ", await ERC20[token].balanceOf(signer.address));
    console.log(
      "before debt",
      await debtERC20[token].balanceOf(signer.address)
    );
    const tx2 = await leverager.borrow(params);
    const receipt2 = await tx2.wait();

    console.log("after ", await ERC20[token].balanceOf(signer.address));
    console.log(
      "after debt ",
      await debtERC20[token].balanceOf(signer.address)
    );

    /// Vanilla Close(Repay)
    params.amount = parseUnits("0.5", "ether");
    params.data = "0x";

    console.log(
      "before debt",
      await debtERC20[token].balanceOf(signer.address)
    );
    const tx3 = await leverager.close(params);
    const receipt4 = await tx3.wait();
    console.log(
      "after debt ",
      await debtERC20[token].balanceOf(signer.address)
    );
  });
  it("Leverage supply DAI to AaveV3", async () => {
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    flags += 2; // leverage

    let amount = parseUnits("1", "ether");

    /// Flashloan data
    const supplyFlashloanData = new AbiCoder().encode(
      ["address", "address", "uint256", "bytes"],
      [
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_DEBT_TOKENS[network][token],
        parseUnits("2", "ether"),
        "0x",
      ]
    );

    /// Leverage Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: supplyFlashloanData,
    };
    leverager.connect(signer);

    /// Leverage Supply

    const tx = await leverager.supply(params);
    const receipt = await tx.wait();
  });

  it("Deleverage DAI using flashloan to AaveV3", async () => {
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    flags += 2; // leverage

    let amount = parseUnits("1", "ether");

    /// Flashloan data
    const supplyFlashloanData = new AbiCoder().encode(
      ["address", "address", "uint256", "bytes"],
      [
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_DEBT_TOKENS[network][token],
        parseUnits("2", "ether"),
        "0x",
      ]
    );

    /// Leverage Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: supplyFlashloanData,
    };
    leverager.connect(signer);

    /// Leverage Supply

    const tx = await leverager.supply(params);
    const receipt = await tx.wait();

    // deleverage

    flags = 0;
    flags += 1; // aave
    const closeFlashloanData = new AbiCoder().encode(
      ["address", "address", "uint256", "bytes"],
      [
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_DEBT_TOKENS[network][token],
        parseUnits("1", "ether"),
        "0x", // chainlink data
      ]
    );
    params.counterAsset = AAVE_V3_A_TOKENS[network][token];
    params.amount = "0";
    params.data = closeFlashloanData;
    params.flags = flags;

    await leverager.close(params);
  });

  it("Get message from CCIP and close the position of AaveV3", async () => {
    const token = "DAI";
    let flags = 0;
    flags += 1; // aave
    flags += 2; // leverage

    let amount = parseUnits("1", "ether");

    /// Flashloan data
    const supplyFlashloanData = new AbiCoder().encode(
      ["address", "address", "uint256", "bytes"],
      [
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_DEBT_TOKENS[network][token],
        parseUnits("2", "ether"),
        "0x",
      ]
    );

    /// Leverage Supply

    const params: ILeverager.InputParamsStruct = {
      asset: MINTABLE_ERC20_TOKENS[network][token],
      counterAsset: AAVE_V3_A_TOKENS[network][token],
      amount: amount,
      flags: flags,
      data: supplyFlashloanData,
    };
    leverager.connect(signer);

    /// Leverage Supply

    const tx = await leverager.supply(params);
    const receipt = await tx.wait();

    const propagator = await leverager.propagator();
    const closeFlashloanData = new AbiCoder().encode(
      ["address", "address", "uint256", "bytes"],
      [
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_DEBT_TOKENS[network][token],
        parseUnits("1", "ether"),
        "0x", // chainlink data
      ]
    );

    const chainlinkData = new AbiCoder().encode(
      ["address", "address", "address", "uint8", "bytes"],
      [
        signer.address,
        MINTABLE_ERC20_TOKENS[network][token],
        AAVE_V3_A_TOKENS[network][token],
        flags,
        closeFlashloanData,
      ]
    );
    const clientMsg: Client.Any2EVMMessageStruct = {
      messageId:
        "0x84bff367c056ff4fd56701c6344e562d924a68688bc280c8b13b47f299472a3f",
      sourceChainSelector: routerConfig[network].chainSelector,
      sender: new AbiCoder().encode(["address"], [propagator]),
      data: chainlinkData,
      destTokenAmounts: [],
    };

    /// donate ethers to router for making fake tx

    await hre.network.provider.send("hardhat_setBalance", [
      routerConfig[network].address,
      "0x" + hre.ethers.parseEther("10").toString(16),
    ]);

    /// impersonate router to send message from chainlink router directly to leverager
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [routerConfig[network].address],
    });
    const routerSigner = await hre.ethers.getSigner(
      routerConfig[network].address
    );

    const leverageCallInstance = Leverager__factory.connect(
      await leverager.getAddress(),
      routerSigner
    );
    await leverageCallInstance.ccipReceive(clientMsg);

    params.amount = "0";

    params.data = closeFlashloanData;
    const tx2 = await leverager.close(params);

    const receipt2 = await tx2.wait();
  });
});
