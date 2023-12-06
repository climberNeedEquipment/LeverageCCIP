import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ethers } from "ethers";
import {
  calculateAaveInterestRate,
  getPrivateKey,
  getProviderRpcUrl,
} from "./utils";

import {
  AAVE_V3_A_TOKENS,
  AAVE_V2_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  AAVE_V2_DEBT_TOKENS,
  LENDING_POOLS,
  MINTABLE_ERC20_TOKENS,
  multicall3Address,
} from "./constants";
import { Wallet, getBigInt } from "ethers";

import {
  IPool__factory,
  Multicall3,
  Multicall3__factory,
  CToken__factory,
  IUiIncentiveDataProviderV3,
  IUiPoolDataProviderV3__factory,
} from "../typechain-types";
import { Spinner } from "../utils/spinner";

task("lending-status", "Gets the balance of tokens for provided address")
  .addParam(`blockchain`, `The blockchain where to check`)
  .setAction(async (taskArguments: TaskArguments) => {
    const rpcProviderUrl = getProviderRpcUrl(taskArguments.blockchain);
    const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
    const privateKey = getPrivateKey();
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(provider);

    const spinner: Spinner = new Spinner();

    const multicall: Multicall3 = Multicall3__factory.connect(
      multicall3Address,
      signer
    );

    const aaveV3PoolDataProvider = IUiPoolDataProviderV3__factory.connect(
      LENDING_POOLS[taskArguments.blockchain].AaveV3UiPoolDataProvider,
      signer
    );

    const aaveV3 = IPool__factory.createInterface();
    const itf = new ethers.Interface([
      "function decimals() view returns(uint8)",
      "function MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
      "function OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
      "function getStableRateExcessOffset() view returns(uint256)",
    ]);
    const aaveV2PoolDataProvider = IPool__factory.createInterface();
    const compoundV2 = CToken__factory.createInterface();

    const aaveV3Data = await aaveV3PoolDataProvider.getReservesData(
      LENDING_POOLS[taskArguments.blockchain].AaveV3AddressProvider
    );

    const aaveV3Status: Record<string, Record<string, string>> = {};
    const aaveV3InterestCalls: Multicall3.Call3Struct[] = [];

    /// unit in a ray=10**27
    aaveV3Data[0].forEach((element) => {
      aaveV3Status[element.name.toString()] = {
        decimals: element.decimals.toString(),
        baseLTVasCollateral: element.baseLTVasCollateral.toString(),
        reserveLiquidationThreshold:
          element.reserveLiquidationThreshold.toString(),
        reserveLiquidationBonus: element.reserveLiquidationBonus.toString(),
        reserveFactor: element.reserveFactor.toString(),
        usageAsCollateralEnabled: element.usageAsCollateralEnabled.toString(),
        availableLiquidity: element.availableLiquidity.toString(),
        totalPrincipalStableDebt: element.totalPrincipalStableDebt.toString(),
        totalScaledVariableDebt: element.totalScaledVariableDebt.toString(),
        averageStableRate: element.averageStableRate.toString(),
        priceInMarketReferenceCurrency:
          element.priceInMarketReferenceCurrency.toString(),
        variableRateSlope1: element.variableRateSlope1.toString(),
        variableRateSlope2: element.variableRateSlope2.toString(),
        stableRateSlope1: element.stableRateSlope1.toString(),
        stableRateSlope2: element.stableRateSlope2.toString(),
        baseStableBorrowRate: element.baseStableBorrowRate.toString(),
        baseVariableBorrowRate: element.baseVariableBorrowRate.toString(),
        optimalUtilizationRate: element.optimalUsageRatio.toString(),
        unbacked: element.unbacked.toString(),
        liquidityIndex: element.liquidityIndex.toString(),
        price: element.priceInMarketReferenceCurrency.toString(),
        liquidityRate2: element.liquidityRate.toString(),
      };
      // get price oracle decimals
      aaveV3InterestCalls.push({
        target: element.priceOracle.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData("decimals"),
      });
      aaveV3InterestCalls.push({
        target: element.interestRateStrategyAddress.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData(
          "MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO"
        ),
      });
      aaveV3InterestCalls.push({
        target: element.interestRateStrategyAddress.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData("OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO"),
      });
      aaveV3InterestCalls.push({
        target: element.interestRateStrategyAddress.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData("getStableRateExcessOffset"),
      });
    });
    const results = await multicall.aggregate3.staticCall(aaveV3InterestCalls);

    let idx = 0;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.success) {
        const name = aaveV3Data[0][idx].name.toString();

        if (i % 4 === 0) {
          aaveV3Status[name]["priceOracleDecimals"] = itf
            .decodeFunctionResult("decimals", result.returnData)
            .toString();
        }
        if (i % 4 === 1) {
          aaveV3Status[name]["maxExcessStableToTotalDebtRatio"] = itf
            .decodeFunctionResult(
              "MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO",
              result.returnData
            )
            .toString();
        }
        if (i % 4 === 2) {
          aaveV3Status[name]["optimalStableToTotalDebtRatio"] = itf
            .decodeFunctionResult(
              "OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO",
              result.returnData
            )
            .toString();
        }
        if (i % 4 === 3) {
          aaveV3Status[name]["stableRateExcessOffset"] = itf
            .decodeFunctionResult(
              "getStableRateExcessOffset",
              result.returnData
            )
            .toString();
          idx += 1;
        }
      }
    }

    aaveV3Data[0].forEach((element) => {
      const name = element.name.toString();

      const interestRate = calculateAaveInterestRate(
        getBigInt(element.totalPrincipalStableDebt),
        getBigInt(element.totalScaledVariableDebt),
        getBigInt(element.availableLiquidity),
        getBigInt(element.optimalUsageRatio),
        getBigInt(aaveV3Status[name].optimalStableToTotalDebtRatio),
        getBigInt(aaveV3Status[name].maxExcessStableToTotalDebtRatio),
        getBigInt(element.baseVariableBorrowRate),
        getBigInt(element.stableRateSlope1),
        getBigInt(element.stableRateSlope2),
        getBigInt(element.variableRateSlope1),
        getBigInt(element.variableRateSlope2),
        getBigInt(element.baseStableBorrowRate),
        getBigInt(aaveV3Status[name].stableRateExcessOffset),
        getBigInt(element.reserveFactor),
        getBigInt(element.unbacked)
      );

      aaveV3Status[element.name.toString()]["borrowUsageRatio"] =
        interestRate.borrowUsageRatio.toString();
      aaveV3Status[element.name.toString()]["liquidityRate"] =
        interestRate.currentLiquidityRate.toString();
      aaveV3Status[element.name.toString()]["stableBorrowRate"] =
        interestRate.currentStableBorrowRate.toString();
      aaveV3Status[element.name.toString()]["variableBorrowRate"] =
        interestRate.currentVariableBorrowRate.toString();
    });

    console.log(aaveV3Status);

    // for (const lending in LENDING_POOLS[taskArguments.blockchain]) {
    //   if (lending.includes("AAVE")) {
    //     aaveCalls.push();
    //     for (const token in MINTABLE_ERC20_TOKENS[taskArguments.blockchain]) {
    //       aaveCalls.push({
    //         target: LENDING_POOLS[taskArguments.blockchain][lending],
    //         allowFailure: true,
    //         callData: aaveV3.encodeFunctionData("getReservesData", [
    //           MINTABLE_ERC20_TOKENS[taskArguments.blockchain][token],
    //         ]),
    //       });

    //       aaveCalls.push({
    //         target: LENDING_POOLS[taskArguments.blockchain][lending],
    //         allowFailure: true,
    //         callData: aaveV3.encodeFunctionData("getReservesData", [
    //           MINTABLE_ERC20_TOKENS[taskArguments.blockchain][token],
    //         ]),
    //       });

    //       aaveCalls.push({
    //         target: lending.includes("3")
    //           ? LENDING_POOLS[taskArguments.blockchain][
    //               "AaveV3IncentivesController"
    //             ]
    //           : LENDING_POOLS[taskArguments.blockchain][
    //               "AaveV2IncentivesController"
    //             ],
    //         allowFailure: true,
    //         callData: aaveV3.encodeFunctionData("getAssetData", [
    //           lending.includes("3")
    //             ? AAVE_V3_A_TOKENS[taskArguments.blockchain][token]
    //             : AAVE_V2_A_TOKENS[taskArguments.blockchain][token],
    //         ]),
    //       });

    //       aaveCalls.push({
    //         target: lending.includes("3")
    //           ? LENDING_POOLS[taskArguments.blockchain][
    //               "AaveV3IncentivesController"
    //             ]
    //           : LENDING_POOLS[taskArguments.blockchain][
    //               "AaveV2IncentivesController"
    //             ],
    //         allowFailure: true,
    //         callData: aaveV3.encodeFunctionData("getAssetData", [
    //           lending.includes("3")
    //             ? AAVE_V3_DEBT_TOKENS[taskArguments.blockchain][token]
    //             : AAVE_V2_DEBT_TOKENS[taskArguments.blockchain][token],
    //         ]),
    //       });
    //     }
    //   }
    // }
    // const results = await multicall.aggregate3.staticCall(aaveCalls);
    // let name = "";
    // for (let i = 0; i < results.length; i++) {
    //   const result = results[i];
    //   if (result.success) {
    //     if (i % 4 === 0) {
    //       name = mockERC20
    //         .decodeFunctionResult("name", result.returnData)
    //         .toString();
    //       walletStatus[name] = {};
    //     }
    //     if (i % 4 === 1) {
    //       walletStatus[name]["decimals"] = mockERC20
    //         .decodeFunctionResult("decimals", result.returnData)
    //         .toString();
    //     }
    //     if (i % 4 === 2) {
    //       walletStatus[name]["balance"] = mockERC20
    //         .decodeFunctionResult("balanceOf", result.returnData)
    //         .toString();
    //     }
    //     if (i % 4 === 3) {
    //       walletStatus[name]["allowance"] =
    //         i % 9 == 8
    //           ? mockERC20
    //               .decodeFunctionResult("borrowAllowance", result.returnData)
    //               .toString()
    //           : mockERC20
    //               .decodeFunctionResult("allowance", result.returnData)
    //               .toString();
    //     }
    //   }
    // }

    // spinner.start();

    // const compV2Status: Record<string, Record<string, string>> = {};

    // const compV2Calls: Multicall3.Call3Struct[] = [];

    // for (const lending in LENDING_POOLS[taskArguments.blockchain]) {
    //   if (lending.includes("Comp")) {
    //     compV2Calls.push({
    //       target: LENDING_POOLS[taskArguments.blockchain][lending],
    //       allowFailure: true,
    //       callData: compoundV2.encodeFunctionData("exchangeRateCurrent"),
    //     });
    //     compV2Calls.push({
    //       target: LENDING_POOLS[taskArguments.blockchain][lending],
    //       allowFailure: true,
    //       callData: compoundV2.encodeFunctionData("supplyRatePerBlock"),
    //     });
    //     compV2Calls.push({
    //       target: LENDING_POOLS[taskArguments.blockchain][lending],
    //       allowFailure: true,
    //       callData: compoundV2.encodeFunctionData("borrowRatePerBlock"),
    //     });
    //     compV2Calls.push({
    //       target: LENDING_POOLS[taskArguments.blockchain][lending],
    //       allowFailure: true,
    //       callData: compoundV2.encodeFunctionData("exchangeRateCurrent"),
    //     });
    //   }
    // }

    // const exchangeRateCurrent = await cToken.methods.exchangeRateCurrent().call();
    // const mantissa = 18 + parseInt(underlyingDecimals) - cTokenDecimals;
    // const oneCTokenInUnderlying = exchangeRateCurrent /10**28;
    // console.log('1 cBAT can be redeemed for', oneCTokenInUnderlying, 'BAT');

    // let name = "";
    // for (let i = 0; i < results.length; i++) {
    //   const result = results[i];
    //   if (result.success) {
    //     if (i % 4 === 0) {
    //       name = mockERC20
    //         .decodeFunctionResult("name", result.returnData)
    //         .toString();
    //       walletStatus[name] = {};
    //     }
    //   }
    // }

    // for (const lending in LENDING_POOLS[taskArguments.blockchain]) {
    //   if (lending.includes("COMPOUND")) {
    //         calls.push({
    //             target:LENDING_POOLS[taskArguments.blockchain][lending],
    //             allowFailure: true,
    //             calldata:
    //         });
    //   }
    // }

    const ethMantissa = 1e18;
    const blocksPerYear = 5 * 60 * 24 * 365; // 12 seconds per block
    const daysPerYear = 365;

    // const supplyRatePerBlock = await cToken.methods.supplyRatePerBlock().call();
    // const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();
    // const supplyApr = supplyRatePerBlock / ethMantissa * blocksPerYear * 100;
    // const borrowApr = borrowRatePerBlock / ethMantissa * blocksPerYear * 100;
    // console.log(`Supply APR ${(supplyApr).toFixed(3)} %`);
    // console.log(`Borrow APR ${(borrowApr).toFixed(3)} %`);

    console.log(
      `ℹ️  Attempting to check the balance of ERC20 tokens (${taskArguments.myNft}) for the ${wallet.address} account`
    );

    spinner.stop();
    // console.log(
    //   `ℹ️  The balance of MyNFTs of the ${
    //     wallet.address
    //   } account is ${BigInt(balanceOf)}`
    // );
  });
