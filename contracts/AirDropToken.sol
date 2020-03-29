pragma solidity ^0.5.16;
import "./ERC20.sol";


contract AirDropToken is ERC20 {
    function () external {
        revert();
    }

    function receive() external payable {
        revert();
    }

    string public name;
    string public symbol;
    string public version = "H1.0";
    address private owner;
    uint32 public amountAirDrop;
    bytes32 private rootHash;
    uint8 public decimals;

    constructor(bytes32 _rootHash) public {
        name = "AirDropToken";
        decimals = 0;
        symbol = "AirDrop";
        rootHash = _rootHash;
        owner = msg.sender;
        amountAirDrop = 1;
    }

    function validateCallerAddress(address _address) internal pure {
        require(_address != address(0), "Error: User is of zero address.");
    }

    modifier _onlyOwner() {
        validateCallerAddress(msg.sender); //  Validate the caller's address
        require(msg.sender == owner, "Error: Caller is not owner.");
        _;
    }

    function setAmountAirDrop(uint32 amount) public _onlyOwner() {
        amountAirDrop = amount;
    }

    function setRootHash(bytes32 _rootHash) public _onlyOwner() {
        rootHash = _rootHash;
    }

    function leafHash(address leaf) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(uint8(0x00), leaf));
    }

    function nodeHash(bytes32 left, bytes32 right)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(uint8(0x01), left, right));
    }

    function redeemToken(
        uint256 path,
        bytes32[] memory witnesses,
        uint256 amount
    ) public {
        require(
            balanceOf(msg.sender).add(amount) <= amountAirDrop,
            "redeemed amount is higher than expected"
        );
        bytes32 node = leafHash(msg.sender);
        for (uint256 i = 0; i < witnesses.length; i++) {
            if ((path & 0x01) == 1) {
                node = nodeHash(witnesses[i], node);
            } else {
                node = nodeHash(node, witnesses[i]);
            }
            path = path / 2;
        }
        require(node == rootHash, "Invalid Proof");

        _mint(msg.sender, amount);
    }

    /* Approves and then calls the receiving contract */
    function approveAndCall(
        address _spender,
        uint256 _value,
        bytes memory _extraData
    ) public returns (bool) {
        approve(_spender, _value);
        emit Approval(msg.sender, _spender, _value);

        (bool success,) = _spender.call(
            abi.encodeWithSignature(
                "receiveApproval(address,uint256,address,bytes)",
                msg.sender,
                _value,
                this,
                _extraData
            )
        );
        if (!success) {
            revert();
        }

        return true;
    }
}
