import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ethers } from "ethers";
import {
  calculateAaveInterestRate,
  getPrivateKey,
  getProviderRpcUrl,
  calculateCompoundedInterest,
  rayMul,
  calculateLinearInterest,
} from "./utils";

import {
  AAVE_V3_A_TOKENS,
  AAVE_V2_A_TOKENS,
  AAVE_V3_DEBT_TOKENS,
  AAVE_V2_DEBT_TOKENS,
  LENDING_POOLS,
  MINTABLE_ERC20_TOKENS,
  multicall3Address,
  APR,
  RewardTokens,
  SECONDS_PER_YEAR,
  RAY,
} from "./constants";
import { Wallet, getBigInt } from "ethers";

import {
  IPool__factory,
  Multicall3,
  Multicall3__factory,
  CToken__factory,
  IUiIncentiveDataProviderV3,
  IUiPoolDataProviderV3__factory,
  IUiIncentiveDataProviderV3__factory,
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

    const aaveV3IncentiveDataProvider =
      IUiIncentiveDataProviderV3__factory.connect(
        LENDING_POOLS[taskArguments.blockchain].AaveV3UiIncentiveDataProvider,
        signer
      );

    const itf = new ethers.Interface([
      "function decimals() view returns(uint8)",
      "function MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
      "function OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO() view returns(uint256)",
      "function getStableRateExcessOffset() view returns(uint256)",
      "function getTotalSupplyLastUpdated() view returns(uint40)",
      "function scaledTotalSupply() view returns(uint256)",
    ]);
    const aaveV2PoolDataProvider = IPool__factory.createInterface();
    const compoundV2 = CToken__factory.createInterface();

    const aaveV3Data = await aaveV3PoolDataProvider.getReservesData(
      LENDING_POOLS[taskArguments.blockchain].AaveV3AddressProvider
    );

    const aaveV3IncentiveData =
      await aaveV3IncentiveDataProvider.getReservesIncentivesData(
        LENDING_POOLS[taskArguments.blockchain].AaveV3AddressProvider
      );

    const aaveV3Status: Record<string, Record<string, string>> = {};
    const aaveV3InterestCalls: Multicall3.Call3Struct[] = [];
    const aaveV3IncentiveCalls: Multicall3.Call3Struct[] = [];

    const TOKEN_ADDRESS_TO_NAME: Record<string, string> = {};

    /// unit in a ray=10**27
    aaveV3Data[0].forEach((element) => {
      const name = element.name.toString();
      aaveV3Status[name] = {
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
        liquidityRate: element.liquidityRate.toString(),
        variableBorrowRate: element.variableBorrowRate.toString(),
        stableBorrowRate: element.stableBorrowRate.toString(),
        reserveLastUpdated: element.lastUpdateTimestamp.toString(),
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
      aaveV3InterestCalls.push({
        target: element.stableDebtTokenAddress.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData("getTotalSupplyLastUpdated"),
      });
      aaveV3InterestCalls.push({
        target: element.aTokenAddress.toString(),
        allowFailure: true,
        callData: itf.encodeFunctionData("scaledTotalSupply"),
      });
      TOKEN_ADDRESS_TO_NAME[element.underlyingAsset.toString()] = name;
    });

    const results = await multicall.aggregate3.staticCall(aaveV3InterestCalls);

    let idx = 0;

    const time = Math.floor(new Date().getTime() / 1000);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.success) {
        const name = aaveV3Data[0][idx].name.toString();

        if (i % 6 === 0) {
          aaveV3Status[name]["priceOracleDecimals"] = itf
            .decodeFunctionResult("decimals", result.returnData)
            .toString();
        }
        if (i % 6 === 1) {
          aaveV3Status[name]["maxExcessStableToTotalDebtRatio"] = itf
            .decodeFunctionResult(
              "MAX_EXCESS_STABLE_TO_TOTAL_DEBT_RATIO",
              result.returnData
            )
            .toString();
        }
        if (i % 6 === 2) {
          aaveV3Status[name]["optimalStableToTotalDebtRatio"] = itf
            .decodeFunctionResult(
              "OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO",
              result.returnData
            )
            .toString();
        }
        if (i % 6 === 3) {
          aaveV3Status[name]["stableRateExcessOffset"] = itf
            .decodeFunctionResult(
              "getStableRateExcessOffset",
              result.returnData
            )
            .toString();
        }

        if (i % 6 === 4) {
          aaveV3Status[name]["stableTotalSupplyLastUpdated"] = itf
            .decodeFunctionResult(
              "getTotalSupplyLastUpdated",
              result.returnData
            )
            .toString();
        }
        if (i % 6 === 5) {
          aaveV3Status[name]["aTokenScaledTotalSupply"] = itf
            .decodeFunctionResult("scaledTotalSupply", result.returnData)
            .toString();
          idx += 1;
        }
      }
    }

    aaveV3Data[0].forEach((element) => {
      const name = element.name.toString();
      console.log(
        "aTokenScaledTotalSupply: ",
        aaveV3Status[name]["aTokenScaledTotalSupply"]
      );

      const totalATokenSupply = rayMul(
        getBigInt(aaveV3Status[name]["aTokenScaledTotalSupply"]),
        rayMul(
          calculateLinearInterest(
            getBigInt(element.liquidityRate),
            getBigInt(time),
            getBigInt(aaveV3Status[name]["reserveLastUpdated"])
          ),
          getBigInt(element.liquidityIndex)
        )
      );

      aaveV3Status[name]["totalATokenSupply"] = totalATokenSupply.toString();

      const totalVariableDebt = rayMul(
        rayMul(
          calculateCompoundedInterest(
            getBigInt(element.variableBorrowRate),
            getBigInt(time),
            getBigInt(aaveV3Status[name]["reserveLastUpdated"])
          ),
          getBigInt(element.variableBorrowIndex)
        ),
        getBigInt(element.totalScaledVariableDebt)
      );
      const totalStableDebt = rayMul(
        getBigInt(element.totalPrincipalStableDebt),
        calculateCompoundedInterest(
          getBigInt(element.averageStableRate),
          getBigInt(time),
          getBigInt(aaveV3Status[name]["stableTotalSupplyLastUpdated"])
        )
      );

      const interestRate = calculateAaveInterestRate(
        totalStableDebt,
        totalVariableDebt,
        getBigInt(element.availableLiquidity),
        getBigInt(element.optimalUsageRatio),
        getBigInt(aaveV3Status[name].optimalStableToTotalDebtRatio as string),
        getBigInt(aaveV3Status[name].maxExcessStableToTotalDebtRatio as string),
        getBigInt(element.baseVariableBorrowRate),
        getBigInt(element.stableRateSlope1),
        getBigInt(element.stableRateSlope2),
        getBigInt(element.variableRateSlope1),
        getBigInt(element.variableRateSlope2),
        getBigInt(element.baseStableBorrowRate),
        getBigInt(aaveV3Status[name].stableRateExcessOffset as string),
        getBigInt(element.reserveFactor),
        getBigInt(element.unbacked)
      );

      aaveV3Status[name]["totalVariableDebt"] = totalVariableDebt.toString();
      aaveV3Status[name]["totalStableDebt"] = totalStableDebt.toString();
      aaveV3Status[name]["borrowUsageRatio"] =
        interestRate.borrowUsageRatio.toString();
      aaveV3Status[name]["liquidityRate"] =
        interestRate.currentLiquidityRate.toString();
      aaveV3Status[name]["stableBorrowRate"] =
        interestRate.currentStableBorrowRate.toString();
      aaveV3Status[name]["variableBorrowRate"] =
        interestRate.currentVariableBorrowRate.toString();
    });

    console.log(aaveV3Status);

    const aaveV3IncentiveStatus: Record<string, APR> = {};

    aaveV3IncentiveData.forEach((element) => {
      const name = TOKEN_ADDRESS_TO_NAME[element.underlyingAsset.toString()];
      aaveV3IncentiveStatus[name] = { rewards: [], totalAPR: "0" };
      let aTotalAPR = getBigInt(0);
      element.aIncentiveData.rewardsTokenInformation.forEach(
        (aIncentiveData) => {
          /// decimals 6
          const numerator =
            getBigInt("1000000") *
            getBigInt(SECONDS_PER_YEAR) *
            getBigInt(aIncentiveData.emissionPerSecond) *
            getBigInt(aIncentiveData.rewardPriceFeed) *
            getBigInt(10) **
              getBigInt(aaveV3Status[name]["priceOracleDecimals"]);

          const denominator =
            getBigInt(aaveV3Status[name]["totalATokenSupply"]) *
            getBigInt(aaveV3Status[name]["price"]) *
            getBigInt(10) ** getBigInt(aIncentiveData.rewardTokenDecimals);

          aaveV3IncentiveStatus[name]["rewards"].push({
            token: aIncentiveData.rewardTokenSymbol,
            tokenPrice: aIncentiveData.rewardPriceFeed.toString(),
            tokenPriceDecimals: aIncentiveData.rewardTokenDecimals.toString(),
            APR: (numerator / denominator).toString(),
          });
          aTotalAPR += numerator / denominator;
        }
      );
      aaveV3IncentiveStatus[name]["totalAPR"] = aTotalAPR.toString();
      let vTotalAPR = getBigInt(0);
      element.vIncentiveData.rewardsTokenInformation.forEach(
        (vIncentiveData) => {
          /// decimals 6
          const numerator =
            getBigInt("1000000") *
            getBigInt(SECONDS_PER_YEAR) *
            getBigInt(vIncentiveData.emissionPerSecond) *
            getBigInt(vIncentiveData.rewardPriceFeed) *
            getBigInt(10) **
              getBigInt(aaveV3Status[name]["priceOracleDecimals"]);

          const denominator =
            getBigInt(aaveV3Status[name]["totalVariableDebt"]) *
            getBigInt(aaveV3Status[name]["price"]) *
            getBigInt(10) ** getBigInt(vIncentiveData.rewardTokenDecimals);

          aaveV3IncentiveStatus[name]["rewards"].push({
            token: vIncentiveData.rewardTokenSymbol,
            tokenPrice: vIncentiveData.rewardPriceFeed.toString(),
            tokenPriceDecimals: vIncentiveData.rewardTokenDecimals.toString(),
            APR: (numerator / denominator).toString(),
          });
          vTotalAPR += numerator / denominator;
        }
      );
    });

    console.log(aaveV3IncentiveStatus);

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
