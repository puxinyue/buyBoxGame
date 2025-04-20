'use client';

import { useState } from 'react';

interface BoxStatus {
  isOpened: boolean;
  isClaimed: boolean;
  prizeType: number;
}

interface LotteryBoxProps {
  boxId: number;
  isOpened: boolean;
  isClaimed: boolean;
  prizeType: number;
  onOpen: () => void;
  onClaim: () => void;
  isOpenLoading?: boolean;
  isClaimLoading?: boolean;
  isConnected: boolean;
  onConnectWallet: () => void;
}

const getPrizeText = (prizeType: number) => {
  switch (prizeType) {
    case 1:
      return '0.002 ETH';
    case 2:
      return '0.1 ETH';
    case 3:
      return '1 ETH';
    case 4:
      return 'NFT';
    default:
      return '未中奖';
  }
};

const getPrizeColor = (prizeType: number) => {
  switch (prizeType) {
    case 1:
      return 'text-blue-500';
    case 2:
      return 'text-purple-500';
    case 3:
      return 'text-yellow-500';
    case 4:
      return 'text-pink-500';
    default:
      return 'text-gray-500';
  }
};

export default function LotteryBox({
  boxId,
  isOpened,
  isClaimed,
  prizeType,
  onOpen,
  onClaim,
  isOpenLoading,
  isClaimLoading,
  isConnected,
  onConnectWallet,
}: LotteryBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isConnected) {
      onConnectWallet();
      return;
    }
    
    if (!isOpened) {
      onOpen();
    } else if (!isClaimed && prizeType !== 0) {
      onClaim();
    }
  };

  return (
    <div
      className={`
        relative w-full aspect-square max-w-[120px] mx-auto rounded-lg shadow-md cursor-pointer
        transition-all duration-300
        ${isOpened ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}
        ${isClaimed ? 'opacity-50' : 'opacity-100'}
        ${isHovered && !isOpened ? 'transform scale-105' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {isOpenLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900" />
        ) : isClaimLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-500" />
        ) : isOpened ? (
          prizeType === 0 ? (
            <span className="text-sm sm:text-base text-gray-500">未中奖</span>
          ) : !isClaimed ? (
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              <span className={`text-xs sm:text-sm font-medium ${getPrizeColor(prizeType)}`}>
                恭喜中奖
              </span>
              <span className={`text-[10px] sm:text-xs ${getPrizeColor(prizeType)}`}>
                {getPrizeText(prizeType)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnected) {
                    onConnectWallet();
                    return;
                  }
                  onClaim();
                }}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-sm rounded-full hover:bg-green-600 transition-colors duration-200 shadow-sm"
              >
                领取奖励
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
              <span className={`text-xs sm:text-sm ${getPrizeColor(prizeType)}`}>
                {getPrizeText(prizeType)}
              </span>
              <span className="text-[10px] sm:text-xs text-green-500">已领取</span>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
            <span className="text-base sm:text-lg font-bold text-gray-700">#{boxId}</span>
            <span className="text-[10px] sm:text-xs text-gray-500">点击开启</span>
          </div>
        )}
      </div>
    </div>
  );
} 