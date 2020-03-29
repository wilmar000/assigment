const AirDropToken = artifacts.require("AirDropToken");
const truffleAssert = require("truffle-assertions");
contract("AirDropToken", (accounts) => {
  let instance;
  before(async () => {
    instance = await AirDropToken.deployed();
  });
  it("Redeem should work properly", async () => {
    const path = 1;
    const witnesses = [
      "0x99c744794ee3a09dfcbbfa3973b8f2bdc901e719643dbd8b54d4ef5a0718594b",
      "0x5e7bddad41da5e44368222d5f43226ce600a25a7c84a4e595377678f6cf926df",
      "0x7414d5d4e9299f64f89d1434e8eb044160c4267a25fbb8eb2958d81004ed4fec",
      "0xea3de2167a22609535dfb29bf3e42c6a40ea4ea54a95f68756d766e7d243e23f"
    ];
    const amount = await instance.amountAirDrop.call();
    await instance.redeemToken(path, witnesses, amount, { from: accounts[1] });
    const balanceToken = await instance.balanceOf(accounts[1]);
    assert.equal(
      balanceToken.toString(),
      amount.toString(),
      "does not receive token"
    );
  });
  it("Cannot redeem exceed amount limit", async () => {
    const path = 2;
    const witnesses = [
      "0x0418fc4fbe0e7158d218a2b5990e00e5ee0cd75eb11896f3a45d498262fe6442",
      "0xe45305d4428c4c2bc17a4fc1e56842ac4522c65f815d0823d8b7fc288decab15",
      "0x7414d5d4e9299f64f89d1434e8eb044160c4267a25fbb8eb2958d81004ed4fec",
      "0xea3de2167a22609535dfb29bf3e42c6a40ea4ea54a95f68756d766e7d243e23f"
    ];
    const amount = await instance.amountAirDrop.call();
    await truffleAssert.fails(
      instance.redeemToken(path, witnesses, amount + 1, { from: accounts[2] }),
      truffleAssert.ErrorType.REVERT
    );
  });
});
