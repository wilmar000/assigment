const fs = require("fs");
const ethers = require("ethers");

if (process.argv.length < 3) {
  console.error("redeem-list merkle tree calculator v1.0.0");
  console.error("    node redeem-tree.js addReceiver <address>");
  console.error("    node redeem-tree.js getRoot");
  console.error("    node redeem-tree.js getProof <your-address>");
  process.exit(1);
}

let mode = process.argv[2];

if (mode === "getRoot") {
  console.log("getRoot: " + merkleRoot(readFileAddress()));
} else if (mode === "getProof") {
  if (process.argv.length < 4) throw "must pass in address to prove";
  let proof = merkleProof(readFileAddress(), process.argv[3]);
  console.log("path: " + proof.path);
  console.log("witnesses: " + JSON.stringify(proof.witnesses));
} else if (mode === "addReceiver") {
  if (process.argv.length < 4) throw "must pass in address to add";
  if (!process.argv[3].startsWith("0x") || process.argv[3].length !== 42)
    throw "wrong address";
  addReceiver(process.argv[3]);
  console.log("getRoot: " + merkleRoot(readFileAddress()));
} else {
  throw "unrecognized mode: " + mode;
}

// interface functions
function readFileAddress() {
  let addresses = fs
    .readFileSync("receiver.txt", "utf-8")
    .split("\n")
    .map((a) => a.replace(/#.*/, "").trim())
    .filter((a) => a.length > 0);
  return addresses;
}
function addReceiver(address) {
  fs.appendFileSync("receiver.txt", `\n ${address} `);
}
function merkleRoot(items) {
  if (items.length === 0) throw "can't build merkle tree with empty items";

  let level = items.map(leafHash);

  while (level.length > 1) {
    level = hashLevel(level);
  }

  return level[0];
}

function merkleProof(items, item) {
  let index = items.findIndex((i) => i === item);
  if (index === -1) throw "item not found in items: " + item;

  let path = [];
  let witnesses = [];

  let level = items.map(leafHash);
  while (level.length > 1) {
    // Get proof for this level

    let nextIndex = Math.floor(index / 2);

    if (nextIndex * 2 === index) {
      // left side
      if (index < level.length - 1) {
        // only if we're not the last in a level with odd number of nodes
        path.push(0);
        witnesses.push(level[index + 1]);
      }
    } else {
      // right side
      path.push(1);
      witnesses.push(level[index - 1]);
    }

    index = nextIndex;
    level = hashLevel(level);
  }

  return {
    path: path.reduceRight((a, b) => (a << 1) | b, 0),
    witnesses
  };
}

// internal utility functions

function hashLevel(level) {
  let nextLevel = [];

  for (let i = 0; i < level.length; i += 2) {
    if (i === level.length - 1) nextLevel.push(level[i]);
    // odd number of nodes at this level
    else nextLevel.push(nodeHash(level[i], level[i + 1]));
  }

  return nextLevel;
}

function leafHash(leaf) {
  return ethers.utils.keccak256(ethers.utils.concat(["0x00", leaf]));
}

function nodeHash(left, right) {
  return ethers.utils.keccak256(ethers.utils.concat(["0x01", left, right]));
}
