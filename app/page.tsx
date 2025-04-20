'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract } from '@wagmi/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { boxLotteryConfig } from './config/contracts';
import LotteryBox from './components/LotteryBox';
import { parseEther } from 'viem';
import { config } from './config/wagmi';

interface BoxStatus {
  isOpened: boolean;
  isClaimed: boolean;
  prizeType: number;
}

type BoxData = readonly [boolean, number, boolean];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedBoxId, setSelectedBoxId] = useState<number>(0);
  const [showConnectTip, setShowConnectTip] = useState(false);
  const [boxes, setBoxes] = useState<BoxStatus[]>(Array(100).fill(null).map(() => ({
    isOpened: false,
    isClaimed: false,
    prizeType: 0
  })));

  // 读取所有盒子状态
  const fetchAllBoxStatus = async () => {
    if (!isConnected) return;
    
    try {
      const newBoxes = [...boxes];
      for (let i = 0; i < 100; i++) {
        try {
          // 获取盒子完整状态
          const result = await readContract(config, {
            address: boxLotteryConfig.address,
            abi: boxLotteryConfig.abi,
            functionName: 'boxes',
            args: [BigInt(i)],
          }) as BoxData;

          newBoxes[i] = {
            isOpened: result[0],
            prizeType: result[1],
            isClaimed: result[2]
          };
        } catch (boxError) {
          console.error(`获取盒子 ${i} 状态失败:`, boxError);
          // 如果获取单个盒子状态失败，继续处理下一个盒子
          continue;
        }
      }
      setBoxes(newBoxes);
    } catch (error) {
      console.error('获取盒子状态失败:', error);
    }
  };

  // 连接钱包后和组件加载时获取状态
  useEffect(() => {
    if (isConnected) {
      fetchAllBoxStatus();
    }
  }, [isConnected]);

  // 开盒子
  const { writeContract: openBox, data: openBoxData } = useWriteContract();

  // 等待开盒子交易完成
  const { isLoading: isOpenBoxLoading, isSuccess: isOpenBoxSuccess } = 
    useWaitForTransactionReceipt({
      hash: openBoxData,
    });

  // 监听开盒子交易完成
  useEffect(() => {
    if (isOpenBoxSuccess) {
      // 更新单个盒子状态
      updateSingleBoxStatus(selectedBoxId);
    }
  }, [isOpenBoxSuccess]);

  // 领取奖励
  const { writeContract: claimPrize, data: claimPrizeData } = useWriteContract();

  // 等待领奖交易完成
  const { isLoading: isClaimLoading, isSuccess: isClaimSuccess } = 
    useWaitForTransactionReceipt({
      hash: claimPrizeData,
    });

  // 监听领奖交易完成
  useEffect(() => {
    if (isClaimSuccess) {
      // 更新单个盒子状态
      updateSingleBoxStatus(selectedBoxId);
    }
  }, [isClaimSuccess]);

  // 更新单个盒子状态
  const updateSingleBoxStatus = async (boxId: number) => {
    if (!isConnected) return;

    try {
      // 获取盒子完整状态
      const result = await readContract(config, {
        address: boxLotteryConfig.address,
        abi: boxLotteryConfig.abi,
        functionName: 'boxes',
        args: [BigInt(boxId)],
      }) as BoxData;

      const newBoxes = [...boxes];
      newBoxes[boxId] = {
        isOpened: result[0],
        prizeType: result[1],
        isClaimed: result[2]
      };
      setBoxes(newBoxes);

      // 显示开盒结果
      if (isOpenBoxSuccess && result[0]) {
        let message = '';
        switch (result[1]) {
          case 0:
            message = '很遗憾，未中奖';
            break;
          case 1:
            message = '恭喜获得 0.002 ETH!';
            break;
          case 2:
            message = '恭喜获得 0.1 ETH!';
            break;
          case 3:
            message = '恭喜获得 1 ETH!';
            break;
          case 4:
            message = '恭喜获得 NFT!';
            break;
        }
        alert(message);
      }
    } catch (error) {
      console.error('更新盒子状态失败:', error);
    }
  };

  const handleOpenBox = async (boxId: number) => {
    if (!isConnected) return;
    try {
      setSelectedBoxId(boxId);
      await openBox({
        address: boxLotteryConfig.address,
        abi: boxLotteryConfig.abi,
        functionName: 'openBox',
        args: [BigInt(boxId)],
        value: parseEther('0.015'),
      });
    } catch (error) {
      console.error('开盒子失败:', error);
      alert('开盒子失败，请检查钱包余额是否足够或稍后重试');
    }
  };

  const handleClaimPrize = async (boxId: number) => {
    if (!isConnected) return;
    try {
      setSelectedBoxId(boxId);
      await claimPrize({
        address: boxLotteryConfig.address,
        abi: boxLotteryConfig.abi,
        functionName: 'claimPrize',
        args: [BigInt(boxId)],
        gas: BigInt(300000),
      });
    } catch (error) {
      console.error('领取奖励失败:', error);
      alert('领取奖励失败，请稍后重试');
    }
  };

  const handleConnectWallet = () => {
    setShowConnectTip(true);
    setTimeout(() => setShowConnectTip(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            幸运盒子抽奖
          </h1>
          <ConnectButton />
        </div>

        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-700">每个盒子 0.015 ETH</p>
          {isConnected && (
            <p className="text-sm text-gray-500 mt-2">当前地址: {address}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4">
          {boxes.map((status, index) => (
            <LotteryBox
              key={index}
              boxId={index}
              isOpened={status.isOpened}
              isClaimed={status.isClaimed}
              prizeType={status.prizeType}
              onOpen={() => handleOpenBox(index)}
              onClaim={() => handleClaimPrize(index)}
              isOpenLoading={isOpenBoxLoading && selectedBoxId === index}
              isClaimLoading={isClaimLoading && selectedBoxId === index}
              isConnected={isConnected}
              onConnectWallet={handleConnectWallet}
            />
          ))}
        </div>

        {/* 全局连接钱包提示 */}
        {showConnectTip && !isConnected && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out">
            Please connect your wallet first
          </div>
        )}
      </div>
    </main>
  );
}
