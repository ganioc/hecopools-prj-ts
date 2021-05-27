## Heco Pools testing project

brick-lib is the lib for communication.

## Updates

```
Need a local light weight sql database to store the data.?
    sqlite3
    typeorm
    reflect-metadata
    

```
## Usage

```
使用handle.ts来手动更新数据库
C
R
U
D

使用函数来实现数据库的手动维护

% node out/test/defi/handle.js list --entity  DefiApp
% node out/test/defi/handle.js list --entity  SmartContract

% node out/test/defi/handle.js removeByName  --entity DefiApp --name BXH 

% node out/test/defi/handle.js addDefault  --entity DefiApp

% node out/test/defi/handle.js addDefault  --entity SmartContract


node out/test/defi/handle.js updateDefault  --entity  Pair  --name BXH

node out/test/defi/handle.js updateDefault  --entity  Pair  --name MDEX --batch 1 --start 640



// malfunction
% node out/test/defi/handle.js test --contract 0x622E1371552Fa865C2edfda0Ba93aCcec504a7CE --name MDEX

// Good functioning
% node out/test/defi/handle.js test --contract 0x23E2ed16Bc4ce3fcab08a5e5d9508ba03F8cF173 --name MDEX

```

## Data Structure

```javascript
DefiApp -> Contract  (one to many)
         pool
         pair

Try something as FILO queue:


Pair=Where token pair is stored, support swap()
Pool=Where MDX-token is deposited, lpToken, 
        Single LP, BXH
        Multi LP, LP token plus BXH

// Info of each pool. BXH
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. BXHs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that BXHs distribution occurs.
        uint256 accBXHPerShare; // Accumulated BXHs per share, times 1e12.
        uint256 accMultLpPerShare; //Accumulated multLp per share
        uint256 totalAmount;    // Total amount of current pool deposit.
    }

    // Info of each pool. MDX
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. MDXs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that MDXs distribution occurs.
        uint256 accMdxPerShare; // Accumulated MDXs per share, times 1e12.
        uint256 accMultLpPerShare; //Accumulated multLp per share
        uint256 totalAmount;    // Total amount of current pool deposit.
    }
```

## Contract Address
### mdex hecoSwap

```


factory  : https://hecoinfo.com/address/0xb0b670fc1F7724119963018DB0BfA86aDb22d941#code
router   : https://hecoinfo.com/address/0xED7d5F38C79115ca12fe6C0041abb22F0A06C300#code
initcode : 0x2ad889f82040abccb2649ea6a874796c1601fb67f91a747a80e08860c73ddf24
MDXToken : https://hecoinfo.com/address/0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c#code
HecoPool : https://hecoinfo.com/address/0xFB03e11D93632D97a8981158A632Dd5986F5E909#code
swapMining : https://hecoinfo.com/address/0x7373c42502874C88954bDd6D50b53061F018422e#code
teamTimeLock : https://hecoinfo.com/address/0xa3FD9758323C8A86292B55702F631c81283c9B79#code
InvestorsTimeLock : https://hecoinfo.com/address/0xa6FE654241140469d1757A5bB8Ee844325059569#code
brandTimeLock : https://hecoinfo.com/address/0x465D246233Ba20e7cfc95743B5d073BE8A7746B0#code
Airdrop  : https://hecoinfo.com/address/0x9197d717a4F45B672aCacaB4CC0C6e09222f8695#code
Repurchase : https://hecoinfo.com/address/0x46900C0c18ace98bAAB81561B9906Dc93287910C#code
BlackHole : https://hecoinfo.com/address/0xF9852C6588b70ad3c26daE47120f174527e03a25#code


14545 pairs

Wrong pair list:
token1 0xb0b670fc1F7724119963018DB0BfA86aDb22d941



```
### Bxh hecoswap

```
Bxh token , 0xcBD6Cb9243d8e3381Fea611EF023e17D1B7AeDF0
HRC20HUSD, 0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047
WHT,  0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F

UniswapV2Router02, 0x00eFB96dBFE641246E961b472C0C3fC472f6a694
UniswapV2Factory, 0xe0367ec2bd4Ba22B1593E4fEFcB91D29DE6C512a
    quote()
    getAmountOut()
    getAmountIn()
    getAmountsOut()
    getAmountsIn()

// uniswapV2Factory.sol
allPairs()
allPairs(0)

```

### BACK hecoswap

```
const addrBackConfig  = "0x51b4fa29dA61715d3384Be9f8a7033bD349Ef629"
const addrBackPairFactory  = "0x3fcB7AF59a84d79F4Ce466E39e62183AC62C0059"
const addrBackPoolFactory = "0xCCE77dCbCDEcC43520144a030CA15B38f6711832"
const addrBackReward = "0xa2B27EaC08d1E792F2CE2d99C0331D0E495c4D80"




```



