/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../../../common";
import type {
  Client,
  ClientInterface,
} from "../../../../../../../@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client";

const _abi = [
  {
    inputs: [],
    name: "EVM_EXTRA_ARGS_V1_TAG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e5610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80633ab8c0d0146038575b600080fd5b603e6052565b604051604991906096565b60405180910390f35b6397a657c960e01b81565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b609081605d565b82525050565b600060208201905060a960008301846089565b9291505056fea26469706673582212200a809d98acb67d4d026c84ee182c86569a424f5e8f84a88885eb0a47391cf07d64736f6c63430008140033";

type ClientConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ClientConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Client__factory extends ContractFactory {
  constructor(...args: ClientConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Client & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Client__factory {
    return super.connect(runner) as Client__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ClientInterface {
    return new Interface(_abi) as ClientInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Client {
    return new Contract(address, _abi, runner) as unknown as Client;
  }
}
