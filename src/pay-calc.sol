// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PayCalc {
    address public owner;
    address public allowedToken;
    uint256 public calcPrice = 1;
    mapping(address => uint256) public results;

    constructor(address _allowedToken) {
        owner = msg.sender;
        allowedToken = _allowedToken;
    }

    function calc(
        address token, 
        uint256 amount,
        uint256 a,
        uint256 b,
        uint8 op
    ) public {
        require(amount == calcPrice, "You can't pay with a larger amount");
        require(token == allowedToken, "Accepts payment in official token only");
        
        uint256 result;
        if (op == 0) { 
            result = a + b;
            require(result >= a && result >= b, "Addition overflow");
        }
        if (op == 1) {
            require(a >= b, "Subtraction underflow");
            result = a - b;
        }
        if (op == 2) {
            require(b != 0, "Division by zero");
            result = a / b;
        }
        if (op == 3) {
            result = a * b;
            require(result / a == b, "Multiplication overflow");
        }

        results[msg.sender] = result;

        IERC20(token).transferFrom(
            msg.sender,
            owner,
            amount
        );
    }

    function resultCalc() view public returns (uint256) {
        return results[msg.sender];
    }
}