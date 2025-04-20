export const CONTRACT_ADDRESS = '0x6eD2282D2BdB7917c94Dd3E09cF0AD0b49A2Af09';
export const NFT_CONTRACT_ADDRESS = '0xe878F36083f98318277BbF149ca29C0c1601493e';
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