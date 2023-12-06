import {
  PayFeesIn,
  routerConfig,
  RAY,
  WAD_RAY_RATIO,
  PERCENTAGE_FACTOR,
} from "./constants";

import {
  AbiCoder,
  ParamType,
  getBigInt,
  getCreate2Address,
  keccak256,
} from "ethers";
import {
  Create2DeployerLocal__factory,
  Create2DeployerLocal,
} from "../typechain-types/contracts";
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

export function rayMul(a: bigint, b: bigint) {
  return (
    (getBigInt(a) * getBigInt(b) + getBigInt(RAY) / getBigInt(2)) /
    getBigInt(RAY)
  );
}

export function rayDiv(a: bigint, b: bigint) {
  return (
    (getBigInt(a) * getBigInt(RAY) + getBigInt(b) / getBigInt(2)) / getBigInt(b)
  );
}

export function wadToRay(a: bigint) {
  return getBigInt(a) * getBigInt(WAD_RAY_RATIO);
}
export function getOverallBorrowRate(
  totalStableDebt: bigint,
  totalVariableDebt: bigint,
  currentVariableBorrowRate: bigint,
  averageStableBorrowRate: bigint
): bigint {
  const totalBorrow = totalStableDebt + totalVariableDebt;
  if (totalBorrow === getBigInt(0)) return getBigInt(0);
  const weightedVariableRate = rayMul(
    wadToRay(totalVariableDebt),
    currentVariableBorrowRate
  );
  const weightedStableRate = rayMul(
    wadToRay(totalStableDebt),
    averageStableBorrowRate
  );
  return rayDiv(
    weightedVariableRate + weightedStableRate,
    wadToRay(totalBorrow)
  );
}

function percentMul(value: bigint, percentage: bigint) {
  return (
    (value * percentage + getBigInt(PERCENTAGE_FACTOR) / getBigInt(2)) /
    getBigInt(PERCENTAGE_FACTOR)
  );
}

export function calculateAaveInterestRate(
  totalStableDebt: bigint,
  totalVariableDebt: bigint,
  availableLiquidity: bigint,
  optimalUtilization: bigint,
  optimalStableToTotalDebtRatio: bigint,
  maxExcessStableToTotalDebtRatio: bigint,
  baseVariableBorrowRate: bigint,
  stableRateSlope1: bigint,
  stableRateSlope2: bigint,
  variableRateSlope1: bigint,
  variableRateSlope2: bigint,
  stableBaseBorrowRate: bigint,
  stableRateExcessOffset: bigint,
  reserveFactor: bigint,
  unbacked: bigint
): {
  borrowUsageRatio: bigint;
  currentLiquidityRate: bigint;
  currentStableBorrowRate: bigint;
  currentVariableBorrowRate: bigint;
} {
  const totalBorrow = totalStableDebt + totalVariableDebt;

  const totalLiquidity = availableLiquidity + totalBorrow;
  let borrowUsageRatio = getBigInt(0);
  let supplyUsageRatio = getBigInt(0);

  let currentVariableBorrowRate = baseVariableBorrowRate;
  let currentStableBorrowRate = stableBaseBorrowRate;
  let stableToTotalDebtRatio = getBigInt(0);
  if (totalBorrow !== getBigInt(0)) {
    stableToTotalDebtRatio = rayDiv(totalStableDebt, totalBorrow);
    borrowUsageRatio = rayDiv(totalBorrow, totalLiquidity);
    supplyUsageRatio = rayDiv(totalBorrow, totalLiquidity + unbacked);
  }

  if (borrowUsageRatio > optimalUtilization) {
    const excessBorrowUsageRatio = rayDiv(
      borrowUsageRatio - optimalUtilization,
      getBigInt(RAY) - optimalUtilization
    );
    currentStableBorrowRate +=
      stableRateSlope1 + rayMul(stableRateSlope2, excessBorrowUsageRatio);
    currentVariableBorrowRate +=
      variableRateSlope1 + rayMul(variableRateSlope2, excessBorrowUsageRatio);
  } else {
    currentStableBorrowRate += rayDiv(
      rayMul(stableRateSlope1, borrowUsageRatio),
      optimalUtilization
    );
    currentVariableBorrowRate += rayDiv(
      rayMul(variableRateSlope1, borrowUsageRatio),
      optimalUtilization
    );
  }

  if (stableToTotalDebtRatio > optimalStableToTotalDebtRatio) {
    const excessStableDebtRatio = rayDiv(
      stableToTotalDebtRatio - optimalStableToTotalDebtRatio,
      maxExcessStableToTotalDebtRatio
    );
    currentStableBorrowRate += rayMul(
      stableRateExcessOffset,
      excessStableDebtRatio
    );
  }

  const currentLiquidityRate = percentMul(
    rayMul(
      getOverallBorrowRate(
        totalStableDebt,
        totalVariableDebt,
        currentVariableBorrowRate,
        currentStableBorrowRate
      ),
      supplyUsageRatio
    ),
    getBigInt(PERCENTAGE_FACTOR) - reserveFactor
  );

  return {
    borrowUsageRatio,
    currentLiquidityRate,
    currentStableBorrowRate,
    currentVariableBorrowRate,
  };
}

export function calculateFlashloanLeverage() {
  // TODO
}
