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
import type { NonPayableOverrides } from "../../common";
import type { MockERC20, MockERC20Interface } from "../../mocks/MockERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approveDelegation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "fromUser",
        type: "address",
      },
      {
        internalType: "address",
        name: "toUser",
        type: "address",
      },
    ],
    name: "borrowAllowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001b9238038062001b92833981810160405281019062000037919062000348565b33828281600390816200004b919062000618565b5080600490816200005d919062000618565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d55760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000cc919062000744565b60405180910390fd5b620000e681620000ef60201b60201c565b50505062000761565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200021e82620001d3565b810181811067ffffffffffffffff8211171562000240576200023f620001e4565b5b80604052505050565b600062000255620001b5565b905062000263828262000213565b919050565b600067ffffffffffffffff821115620002865762000285620001e4565b5b6200029182620001d3565b9050602081019050919050565b60005b83811015620002be578082015181840152602081019050620002a1565b60008484015250505050565b6000620002e1620002db8462000268565b62000249565b9050828152602081018484840111156200030057620002ff620001ce565b5b6200030d8482856200029e565b509392505050565b600082601f8301126200032d576200032c620001c9565b5b81516200033f848260208601620002ca565b91505092915050565b60008060408385031215620003625762000361620001bf565b5b600083015167ffffffffffffffff811115620003835762000382620001c4565b5b620003918582860162000315565b925050602083015167ffffffffffffffff811115620003b557620003b4620001c4565b5b620003c38582860162000315565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200042057607f821691505b602082108103620004365762000435620003d8565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004a07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000461565b620004ac868362000461565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620004f9620004f3620004ed84620004c4565b620004ce565b620004c4565b9050919050565b6000819050919050565b6200051583620004d8565b6200052d620005248262000500565b8484546200046e565b825550505050565b600090565b6200054462000535565b620005518184846200050a565b505050565b5b8181101562000579576200056d6000826200053a565b60018101905062000557565b5050565b601f821115620005c85762000592816200043c565b6200059d8462000451565b81016020851015620005ad578190505b620005c5620005bc8562000451565b83018262000556565b50505b505050565b600082821c905092915050565b6000620005ed60001984600802620005cd565b1980831691505092915050565b6000620006088383620005da565b9150826002028217905092915050565b6200062382620003cd565b67ffffffffffffffff8111156200063f576200063e620001e4565b5b6200064b825462000407565b620006588282856200057d565b600060209050601f8311600181146200069057600084156200067b578287015190505b620006878582620005fa565b865550620006f7565b601f198416620006a0866200043c565b60005b82811015620006ca57848901518255600182019150602085019450602081019050620006a3565b86831015620006ea5784890151620006e6601f891682620005da565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200072c82620006ff565b9050919050565b6200073e816200071f565b82525050565b60006020820190506200075b600083018462000733565b92915050565b61142180620007716000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806370a08231116100a257806395d89b411161007157806395d89b41146102a6578063a9059cbb146102c4578063c04a8a10146102f4578063dd62ed3e14610310578063f2fde38b146103405761010b565b806370a0823114610232578063715018a61461026257806379cc67901461026c5780638da5cb5b146102885761010b565b8063313ce567116100de578063313ce567146101ac57806340c10f19146101ca57806342966c68146101e65780636bd76d24146102025761010b565b806306fdde0314610110578063095ea7b31461012e57806318160ddd1461015e57806323b872dd1461017c575b600080fd5b61011861035c565b6040516101259190610fdc565b60405180910390f35b61014860048036038101906101439190611097565b6103ee565b60405161015591906110f2565b60405180910390f35b610166610411565b604051610173919061111c565b60405180910390f35b61019660048036038101906101919190611137565b61041b565b6040516101a391906110f2565b60405180910390f35b6101b461044a565b6040516101c191906111a6565b60405180910390f35b6101e460048036038101906101df9190611097565b610453565b005b61020060048036038101906101fb91906111c1565b610469565b005b61021c600480360381019061021791906111ee565b61047d565b604051610229919061111c565b60405180910390f35b61024c6004803603810190610247919061122e565b6104ba565b604051610259919061111c565b60405180910390f35b61026a610502565b005b61028660048036038101906102819190611097565b610516565b005b610290610536565b60405161029d919061126a565b60405180910390f35b6102ae610560565b6040516102bb9190610fdc565b60405180910390f35b6102de60048036038101906102d99190611097565b6105f2565b6040516102eb91906110f2565b60405180910390f35b61030e60048036038101906103099190611097565b610615565b005b61032a600480360381019061032591906111ee565b610650565b604051610337919061111c565b60405180910390f35b61035a6004803603810190610355919061122e565b6106d7565b005b60606003805461036b906112b4565b80601f0160208091040260200160405190810160405280929190818152602001828054610397906112b4565b80156103e45780601f106103b9576101008083540402835291602001916103e4565b820191906000526020600020905b8154815290600101906020018083116103c757829003601f168201915b5050505050905090565b6000806103f961075d565b9050610406818585610765565b600191505092915050565b6000600254905090565b60008061042661075d565b9050610433858285610777565b61043e85858561080b565b60019150509392505050565b60006012905090565b61045b6108ff565b6104658282610986565b5050565b61047a61047461075d565b82610a08565b50565b60006040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b190611331565b60405180910390fd5b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61050a6108ff565b6105146000610a8a565b565b6105288261052261075d565b83610777565b6105328282610a08565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461056f906112b4565b80601f016020809104026020016040519081016040528092919081815260200182805461059b906112b4565b80156105e85780601f106105bd576101008083540402835291602001916105e8565b820191906000526020600020905b8154815290600101906020018083116105cb57829003601f168201915b5050505050905090565b6000806105fd61075d565b905061060a81858561080b565b600191505092915050565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064790611331565b60405180910390fd5b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6106df6108ff565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036107515760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610748919061126a565b60405180910390fd5b61075a81610a8a565b50565b600033905090565b6107728383836001610b50565b505050565b60006107838484610650565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461080557818110156107f5578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016107ec93929190611351565b60405180910390fd5b61080484848484036000610b50565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361087d5760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610874919061126a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108ef5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108e6919061126a565b60405180910390fd5b6108fa838383610d27565b505050565b61090761075d565b73ffffffffffffffffffffffffffffffffffffffff16610925610536565b73ffffffffffffffffffffffffffffffffffffffff16146109845761094861075d565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161097b919061126a565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036109f85760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016109ef919061126a565b60405180910390fd5b610a0460008383610d27565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610a7a5760006040517f96c6fd1e000000000000000000000000000000000000000000000000000000008152600401610a71919061126a565b60405180910390fd5b610a8682600083610d27565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610bc25760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610bb9919061126a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c345760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610c2b919061126a565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610d21578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610d18919061111c565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d79578060026000828254610d6d91906113b7565b92505081905550610e4c565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610e05578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610dfc93929190611351565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e955780600260008282540392505081905550610ee2565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610f3f919061111c565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610f86578082015181840152602081019050610f6b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610fae82610f4c565b610fb88185610f57565b9350610fc8818560208601610f68565b610fd181610f92565b840191505092915050565b60006020820190508181036000830152610ff68184610fa3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061102e82611003565b9050919050565b61103e81611023565b811461104957600080fd5b50565b60008135905061105b81611035565b92915050565b6000819050919050565b61107481611061565b811461107f57600080fd5b50565b6000813590506110918161106b565b92915050565b600080604083850312156110ae576110ad610ffe565b5b60006110bc8582860161104c565b92505060206110cd85828601611082565b9150509250929050565b60008115159050919050565b6110ec816110d7565b82525050565b600060208201905061110760008301846110e3565b92915050565b61111681611061565b82525050565b6000602082019050611131600083018461110d565b92915050565b6000806000606084860312156111505761114f610ffe565b5b600061115e8682870161104c565b935050602061116f8682870161104c565b925050604061118086828701611082565b9150509250925092565b600060ff82169050919050565b6111a08161118a565b82525050565b60006020820190506111bb6000830184611197565b92915050565b6000602082840312156111d7576111d6610ffe565b5b60006111e584828501611082565b91505092915050565b6000806040838503121561120557611204610ffe565b5b60006112138582860161104c565b92505060206112248582860161104c565b9150509250929050565b60006020828403121561124457611243610ffe565b5b60006112528482850161104c565b91505092915050565b61126481611023565b82525050565b600060208201905061127f600083018461125b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806112cc57607f821691505b6020821081036112df576112de611285565b5b50919050565b7f6e6f7420696d706c656d656e7465640000000000000000000000000000000000600082015250565b600061131b600f83610f57565b9150611326826112e5565b602082019050919050565b6000602082019050818103600083015261134a8161130e565b9050919050565b6000606082019050611366600083018661125b565b611373602083018561110d565b611380604083018461110d565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006113c282611061565b91506113cd83611061565b92508282019050808211156113e5576113e4611388565b5b9291505056fea2646970667358221220396def3816dff598118bc39f78b12079343902335ad9f5340b21485919af278a64736f6c63430008140033";

type MockERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockERC20__factory extends ContractFactory {
  constructor(...args: MockERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override deploy(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(name, symbol, overrides || {}) as Promise<
      MockERC20 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockERC20__factory {
    return super.connect(runner) as MockERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC20Interface {
    return new Interface(_abi) as MockERC20Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): MockERC20 {
    return new Contract(address, _abi, runner) as unknown as MockERC20;
  }
}
