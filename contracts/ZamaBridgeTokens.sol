// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {ERC7984ERC20Wrapper} from "@openzeppelin/confidential-contracts/token/ERC7984/extensions/ERC7984ERC20Wrapper.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";

contract MintableERC20 is ERC20 {
    uint8 private immutable _customDecimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        _customDecimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _customDecimals;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function faucet(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}

abstract contract BaseConfidentialWrapper is SepoliaConfig, ERC7984ERC20Wrapper {
    constructor(IERC20 underlying, string memory name_, string memory symbol_, string memory contractURI_)
        ERC7984(name_, symbol_, contractURI_)
        ERC7984ERC20Wrapper(underlying)
    {}

    function _fallbackUnderlyingDecimals() internal pure override returns (uint8) {
        return 6;
    }

    function _maxDecimals() internal pure override returns (uint8) {
        return 6;
    }
}

contract ZamaToken is MintableERC20 {
    constructor() MintableERC20("Zama Test Token", "ZAMA", 6) {}
}

contract USDCTestToken is MintableERC20 {
    constructor() MintableERC20("USD Coin Test Token", "USDC", 6) {}
}

contract ETHTestToken is MintableERC20 {
    constructor() MintableERC20("Ether Test Token", "ETH", 6) {}
}

contract ConfidentialZamaToken is BaseConfidentialWrapper {
    constructor(IERC20 underlying)
        BaseConfidentialWrapper(underlying, "Confidential Zama Token", "cZAMA", "")
    {}
}

contract ConfidentialUSDCToken is BaseConfidentialWrapper {
    constructor(IERC20 underlying)
        BaseConfidentialWrapper(underlying, "Confidential USD Coin", "cUSDC", "")
    {}
}

contract ConfidentialETHToken is BaseConfidentialWrapper {
    constructor(IERC20 underlying)
        BaseConfidentialWrapper(underlying, "Confidential Ether", "cETH", "")
    {}
}
