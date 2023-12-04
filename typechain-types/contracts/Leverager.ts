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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace ILeverager {
  export type InputParamsStruct = {
    asset: AddressLike;
    counterAsset: AddressLike;
    amount: BigNumberish;
    flags: BigNumberish;
    data: BytesLike;
  };

  export type InputParamsStructOutput = [
    asset: string,
    counterAsset: string,
    amount: bigint,
    flags: bigint,
    data: string
  ] & {
    asset: string;
    counterAsset: string;
    amount: bigint;
    flags: bigint;
    data: string;
  };
}

export declare namespace Client {
  export type EVMTokenAmountStruct = {
    token: AddressLike;
    amount: BigNumberish;
  };

  export type EVMTokenAmountStructOutput = [token: string, amount: bigint] & {
    token: string;
    amount: bigint;
  };

  export type Any2EVMMessageStruct = {
    messageId: BytesLike;
    sourceChainSelector: BigNumberish;
    sender: BytesLike;
    data: BytesLike;
    destTokenAmounts: Client.EVMTokenAmountStruct[];
  };

  export type Any2EVMMessageStructOutput = [
    messageId: string,
    sourceChainSelector: bigint,
    sender: string,
    data: string,
    destTokenAmounts: Client.EVMTokenAmountStructOutput[]
  ] & {
    messageId: string;
    sourceChainSelector: bigint;
    sender: string;
    data: string;
    destTokenAmounts: Client.EVMTokenAmountStructOutput[];
  };
}

export interface LeveragerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "WETH9"
      | "borrow"
      | "ccipReceive"
      | "close"
      | "executeOperation"
      | "getRouter"
      | "i_link"
      | "owner"
      | "propagator"
      | "renounceOwnership"
      | "supply"
      | "supportsInterface"
      | "transferOwnership"
      | "vault"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Close"
      | "Deleverage"
      | "Leverage"
      | "MessageReceived"
      | "OwnershipTransferred"
      | "Supply"
      | "Withdraw"
  ): EventFragment;

  encodeFunctionData(functionFragment: "WETH9", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "borrow",
    values: [ILeverager.InputParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "ccipReceive",
    values: [Client.Any2EVMMessageStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "close",
    values: [ILeverager.InputParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "executeOperation",
    values: [
      AddressLike[],
      BigNumberish[],
      BigNumberish[],
      AddressLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "getRouter", values?: undefined): string;
  encodeFunctionData(functionFragment: "i_link", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "propagator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supply",
    values: [ILeverager.InputParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [ILeverager.InputParamsStruct]
  ): string;

  decodeFunctionResult(functionFragment: "WETH9", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "borrow", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ccipReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "close", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "executeOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRouter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "i_link", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "propagator", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "supply", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace CloseEvent {
  export type InputTuple = [
    user: AddressLike,
    srcChainId: BigNumberish,
    dstChainId: BigNumberish,
    amount: BigNumberish,
    ltv: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    srcChainId: bigint,
    dstChainId: bigint,
    amount: bigint,
    ltv: bigint
  ];
  export interface OutputObject {
    user: string;
    srcChainId: bigint;
    dstChainId: bigint;
    amount: bigint;
    ltv: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DeleverageEvent {
  export type InputTuple = [
    user: AddressLike,
    token: AddressLike,
    amount: BigNumberish,
    ltv: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    token: string,
    amount: bigint,
    ltv: bigint
  ];
  export interface OutputObject {
    user: string;
    token: string;
    amount: bigint;
    ltv: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LeverageEvent {
  export type InputTuple = [
    user: AddressLike,
    token: AddressLike,
    amount: BigNumberish,
    ltv: BigNumberish
  ];
  export type OutputTuple = [
    user: string,
    token: string,
    amount: bigint,
    ltv: bigint
  ];
  export interface OutputObject {
    user: string;
    token: string;
    amount: bigint;
    ltv: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MessageReceivedEvent {
  export type InputTuple = [
    messageId: BytesLike,
    sourceChainSelector: BigNumberish,
    sender: AddressLike,
    text: string
  ];
  export type OutputTuple = [
    messageId: string,
    sourceChainSelector: bigint,
    sender: string,
    text: string
  ];
  export interface OutputObject {
    messageId: string;
    sourceChainSelector: bigint;
    sender: string;
    text: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SupplyEvent {
  export type InputTuple = [
    user: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [user: string, token: string, amount: bigint];
  export interface OutputObject {
    user: string;
    token: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [
    user: AddressLike,
    token: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [user: string, token: string, amount: bigint];
  export interface OutputObject {
    user: string;
    token: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Leverager extends BaseContract {
  connect(runner?: ContractRunner | null): Leverager;
  waitForDeployment(): Promise<this>;

  interface: LeveragerInterface;

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

  WETH9: TypedContractMethod<[], [string], "view">;

  borrow: TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "nonpayable"
  >;

  ccipReceive: TypedContractMethod<
    [message: Client.Any2EVMMessageStruct],
    [void],
    "nonpayable"
  >;

  close: TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "payable"
  >;

  executeOperation: TypedContractMethod<
    [
      assets: AddressLike[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: AddressLike,
      params: BytesLike
    ],
    [boolean],
    "nonpayable"
  >;

  getRouter: TypedContractMethod<[], [string], "view">;

  i_link: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  propagator: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  supply: TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "payable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  vault: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "WETH9"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "borrow"
  ): TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "ccipReceive"
  ): TypedContractMethod<
    [message: Client.Any2EVMMessageStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "close"
  ): TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "executeOperation"
  ): TypedContractMethod<
    [
      assets: AddressLike[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: AddressLike,
      params: BytesLike
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getRouter"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "i_link"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "propagator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supply"
  ): TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "payable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "vault"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [inputParams: ILeverager.InputParamsStruct],
    [bigint],
    "nonpayable"
  >;

  getEvent(
    key: "Close"
  ): TypedContractEvent<
    CloseEvent.InputTuple,
    CloseEvent.OutputTuple,
    CloseEvent.OutputObject
  >;
  getEvent(
    key: "Deleverage"
  ): TypedContractEvent<
    DeleverageEvent.InputTuple,
    DeleverageEvent.OutputTuple,
    DeleverageEvent.OutputObject
  >;
  getEvent(
    key: "Leverage"
  ): TypedContractEvent<
    LeverageEvent.InputTuple,
    LeverageEvent.OutputTuple,
    LeverageEvent.OutputObject
  >;
  getEvent(
    key: "MessageReceived"
  ): TypedContractEvent<
    MessageReceivedEvent.InputTuple,
    MessageReceivedEvent.OutputTuple,
    MessageReceivedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Supply"
  ): TypedContractEvent<
    SupplyEvent.InputTuple,
    SupplyEvent.OutputTuple,
    SupplyEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;

  filters: {
    "Close(address,uint256,uint256,uint256,uint256)": TypedContractEvent<
      CloseEvent.InputTuple,
      CloseEvent.OutputTuple,
      CloseEvent.OutputObject
    >;
    Close: TypedContractEvent<
      CloseEvent.InputTuple,
      CloseEvent.OutputTuple,
      CloseEvent.OutputObject
    >;

    "Deleverage(address,address,uint256,uint256)": TypedContractEvent<
      DeleverageEvent.InputTuple,
      DeleverageEvent.OutputTuple,
      DeleverageEvent.OutputObject
    >;
    Deleverage: TypedContractEvent<
      DeleverageEvent.InputTuple,
      DeleverageEvent.OutputTuple,
      DeleverageEvent.OutputObject
    >;

    "Leverage(address,address,uint256,uint256)": TypedContractEvent<
      LeverageEvent.InputTuple,
      LeverageEvent.OutputTuple,
      LeverageEvent.OutputObject
    >;
    Leverage: TypedContractEvent<
      LeverageEvent.InputTuple,
      LeverageEvent.OutputTuple,
      LeverageEvent.OutputObject
    >;

    "MessageReceived(bytes32,uint64,address,string)": TypedContractEvent<
      MessageReceivedEvent.InputTuple,
      MessageReceivedEvent.OutputTuple,
      MessageReceivedEvent.OutputObject
    >;
    MessageReceived: TypedContractEvent<
      MessageReceivedEvent.InputTuple,
      MessageReceivedEvent.OutputTuple,
      MessageReceivedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Supply(address,address,uint256)": TypedContractEvent<
      SupplyEvent.InputTuple,
      SupplyEvent.OutputTuple,
      SupplyEvent.OutputObject
    >;
    Supply: TypedContractEvent<
      SupplyEvent.InputTuple,
      SupplyEvent.OutputTuple,
      SupplyEvent.OutputObject
    >;

    "Withdraw(address,address,uint256)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
  };
}
