# creatures-contract

## RULES

User has to burn 450 ERC20 Croakens tokens, and 2 ERC721 Swampverse NFT to mint 1 ERC721A Creature NFT.


## Project Structure

`mock` contains not-exact copy of both Croakens and Swampverse

`mocks/interface` contains interfaces for each of them, i know i could use the contracts itself, but i just
like working with more organized way, thus using interfaces. 

`test` contains base tests to check `mintCreature` functionality, so far it proven that nothing is wrong in contract.

## Limitations

One major limitation was fact that original Swampverse contract has no publicly exposed `_burn` function, thus it's impossible
to burn tokens properly or send them to `address(0)`. Thus we are sending it to `0x00...dEaD`, which is fine but not for Opensea,
since it wont remove tokens sent to mentioned address from collection pages, hope they will change this. Nothing tragical tho. 

## Bugs

`none`

## TODO

-[x] add enable/disable switch on mint function
-[ ] update deployed contract (due to painful process of verifying using etherscan apis and getting contracts ready for UI, 
i might as well avoid this step since its very simple)
-[ ] add more test cases
-[ ] maybe make error messages more user friendly?
-[ ] go back to old ERC721A commit (as mentioned in audit, huge thing, will do later)
