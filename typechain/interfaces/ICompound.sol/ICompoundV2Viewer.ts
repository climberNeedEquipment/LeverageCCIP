/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace ICompoundV2Viewer {
  export type CompV2PoolParamsResponseStruct = {
    token: AddressLike;
    decimals: BigNumberish;
    underlyingToken: AddressLike;
    underlyingDecimals: BigNumberish;
    reserveFactorMantissa: BigNumberish;
    isListed: boolean;
    mintPaused: boolean;
    borrowPaused: boolean;
    collateralFactorMantissa: BigNumberish;
  };

  export type CompV2PoolParamsResponseStructOutput = [
    token: string,
    decimals: bigint,
    underlyingToken: string,
    underlyingDecimals: bigint,
    reserveFactorMantissa: bigint,
    isListed: boolean,
    mintPaused: boolean,
    borrowPaused: boolean,
    collateralFactorMantissa: bigint
  ] & {
    token: string;
    decimals: bigint;
    underlyingToken: string;
    underlyingDecimals: bigint;
    reserveFactorMantissa: bigint;
    isListed: boolean;
    mintPaused: boolean;
    borrowPaused: boolean;
    collateralFactorMantissa: bigint;
  };

  export type CompV2PoolStateResponseStruct = {
    currentNumber: BigNumberish;
    accrualNumber: BigNumberish;
    exchangeRate: BigNumberish;
    supplyRate: BigNumberish;
    borrowRate: BigNumberish;
    totalBorrows: BigNumberish;
    totalReserves: BigNumberish;
    totalSupply: BigNumberish;
    totalCash: BigNumberish;
    borrowCap: BigNumberish;
    isPerBlock: boolean;
  };

  export type CompV2PoolStateResponseStructOutput = [
    currentNumber: bigint,
    accrualNumber: bigint,
    exchangeRate: bigint,
    supplyRate: bigint,
    borrowRate: bigint,
    totalBorrows: bigint,
    totalReserves: bigint,
    totalSupply: bigint,
    totalCash: bigint,
    borrowCap: bigint,
    isPerBlock: boolean
  ] & {
    currentNumber: bigint;
    accrualNumber: bigint;
    exchangeRate: bigint;
    supplyRate: bigint;
    borrowRate: bigint;
    totalBorrows: bigint;
    totalReserves: bigint;
    totalSupply: bigint;
    totalCash: bigint;
    borrowCap: bigint;
    isPerBlock: boolean;
  };
}

export interface ICompoundV2ViewerInterface extends Interface {
  getFunction(
    nameOrSignature: "compV2PoolParams" | "compV2PoolState"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "compV2PoolParams",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "compV2PoolState",
    values: [AddressLike, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "compV2PoolParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "compV2PoolState",
    data: BytesLike
  ): Result;
}

export interface ICompoundV2Viewer extends BaseContract {
  connect(runner?: ContractRunner | null): ICompoundV2Viewer;
  waitForDeployment(): Promise<this>;

  interface: ICompoundV2ViewerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  compV2PoolParams: TypedContractMethod<
    [comptroller: AddressLike, pool: AddressLike],
    [ICompoundV2Viewer.CompV2PoolParamsResponseStructOutput],
    "view"
  >;

  compV2PoolState: TypedContractMethod<
    [comptroller: AddressLike, pool: AddressLike],
    [ICompoundV2Viewer.CompV2PoolStateResponseStructOutput],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "compV2PoolParams"
  ): TypedContractMethod<
    [comptroller: AddressLike, pool: AddressLike],
    [ICompoundV2Viewer.CompV2PoolParamsResponseStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "compV2PoolState"
  ): TypedContractMethod<
    [comptroller: AddressLike, pool: AddressLike],
    [ICompoundV2Viewer.CompV2PoolStateResponseStructOutput],
    "view"
  >;

  filters: {};
}
