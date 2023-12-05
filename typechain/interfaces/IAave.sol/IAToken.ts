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

export interface IATokenInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "POOL"
      | "getIncentivesController"
      | "principalBalanceOf"
      | "redeem"
      | "rescueTokens"
      | "scaledBalanceOf"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "POOL", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getIncentivesController",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "principalBalanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "rescueTokens",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "scaledBalanceOf",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "POOL", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getIncentivesController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "principalBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rescueTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "scaledBalanceOf",
    data: BytesLike
  ): Result;
}

export interface IAToken extends BaseContract {
  connect(runner?: ContractRunner | null): IAToken;
  waitForDeployment(): Promise<this>;

  interface: IATokenInterface;

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

  POOL: TypedContractMethod<[], [string], "view">;

  getIncentivesController: TypedContractMethod<[], [string], "view">;

  principalBalanceOf: TypedContractMethod<
    [user: AddressLike],
    [bigint],
    "view"
  >;

  redeem: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;

  rescueTokens: TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  scaledBalanceOf: TypedContractMethod<[user: AddressLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "POOL"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getIncentivesController"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "principalBalanceOf"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "redeem"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rescueTokens"
  ): TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "scaledBalanceOf"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;

  filters: {};
}