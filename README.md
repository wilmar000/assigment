# Air Drop ERC20Token (Optimized with Merkle Tree)

## Introduction

The assignment for Advance Smart Contract course in George Brown College

## Student Information

Wilmar Lopez Perez

## High-level Design

The project optimizes and secures Air Drop process for ERC Token.

## Implementation Details

### AirDropToken.sol

- ERC20 token with full basic functions.

* **Customed Feature**:

| Name             | Input                                                    | Accessible | Functionality                                                                                         |
| ---------------- | -------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| redeemToken      | uint256 path, bytes32[] memory witnesses, uint256 amount | public     | allow users redeem token, users need to have path and witnesses to redeem, amount is limited by owner |
| leafHash         | address                                                  | private    | hash leaf                                                                                             |
| nodeHash         | address                                                  | private    | hash node                                                                                             |
| setAmountAirDrop | uint256                                                  | onlyOwner  | set the maximum amount for users to redeem                                                            |
| setRootHash      | uint256                                                  | onlyOwner  | set Root Hash                                                                                         |

### redeem-tree.js

| Name        | Input   | Functionality                                          |
| ----------- | ------- | ------------------------------------------------------ |
| addReceiver | address | add receiver to receiver list so they can redeem token |
| getRoot     | 0       | return root hash of merkle tree                        |
| getProof    | address | get path and witnesses for input address               |

## Gas Cost Optimizations

Merkle tree saves the gas for Air Drop process. In normal way, loop is needed to distribute token to every single address; that costs a huge gas. With Merkle, users just need to proof to get the token.

## Test

![](/documentation/testcase.png "Testcase for AirDropToken")

## Usage

Install package truffle and run ganache CLI

```
npm install
npm install -g ganache-cli
ganache-cli -d
npm install -g truffle
truffle migrate

npm test
```

Add receiver to file List

```
node redeem-tree.js addReceiver <address input>
```

Get root hash

```
node redeem-tree.js getRoot
```

Get proof

```
node redeem-tree.js getProof <address input>
```
