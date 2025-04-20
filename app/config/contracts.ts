export const CONTRACT_ADDRESS = '0x6CeA8fC5716E17ae124894640E7BD1E13ee6e1Cd';
export const NFT_CONTRACT_ADDRESS = '0x9701dE22237338745Cd426ed5bC96285D10E43D6';
export const boxLotteryABI = [
  {
    inputs: [{ name: 'boxId', type: 'uint256' }],
    name: 'openBox',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'boxId', type: 'uint256' }],
    name: 'claimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'boxId', type: 'uint256' }],
    name: 'getBoxStatus',
    outputs: [
      { name: 'opened', type: 'bool' },
      { name: 'claimed', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'boxId', type: 'uint256' }],
    name: 'getPrizeType',
    outputs: [{ name: 'prizeType', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'boxes',
    outputs: [
      { name: 'opened', type: 'bool' },
      { name: 'prizeType', type: 'uint8' },
      { name: 'claimed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setNFTTokenContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "safeMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    type: 'function',
  },  
] as const;

export const boxLotteryConfig = {
  address: CONTRACT_ADDRESS,
  nftAddress: NFT_CONTRACT_ADDRESS,
  abi: boxLotteryABI,
} as const; 