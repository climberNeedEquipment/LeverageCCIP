/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ILendingViewer,
  ILendingViewerInterface,
} from "../../interfaces/ILendingViewer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "supplyToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "borrowToken",
        type: "address",
      },
    ],
    name: "balance",
    outputs: [
      {
        internalType: "uint256",
        name: "collaterals",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debts",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "supplyToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "borrowToken",
        type: "address",
      },
    ],
    name: "interestRates",
    outputs: [
      {
        internalType: "uint256",
        name: "lending",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrowing",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateralAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "debtAsset",
        type: "address",
      },
    ],
    name: "liquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "lending",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrowing",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateralAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "debtAsset",
        type: "address",
      },
    ],
    name: "ltv",
    outputs: [
      {
        internalType: "uint256",
        name: "ltv",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "price",
    outputs: [
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ILendingViewer__factory {
  static readonly abi = _abi;
  static createInterface(): ILendingViewerInterface {
    return new Interface(_abi) as ILendingViewerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ILendingViewer {
    return new Contract(address, _abi, runner) as unknown as ILendingViewer;
  }
}