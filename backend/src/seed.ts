import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProtocolOption from './models/ProtocolOption';
import logger from './utils/logger';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found');
    }

    await mongoose.connect(mongoUri);
    logger.success('Connected to MongoDB', { service: 'Seed' });

    // Clear existing data
    await ProtocolOption.deleteMany({});
    logger.info('Cleared existing protocol options', { service: 'Seed' });

    // Seed data - Updated with deployed Sepolia adapter addresses
    const options = [
      {
        id: 'uniswap-weth-sepolia',
        protocol: 'Uniswap V3',
        token: 'WETH',
        apy: 5.2,
        tvl: '$1.2B',
        risk: 'Medium',
        adapterAddress: '0xb8152050eCd324186eC1704fD0dF7853380A6aa7',
        isActive: true,
        network: 'sepolia'
      },
      {
        id: 'lido-weth-sepolia',
        protocol: 'Lido',
        token: 'WETH',
        apy: 3.8,
        tvl: '$15B',
        risk: 'Low',
        adapterAddress: '0x8fEB6f4aA42Aec109b5a95A2653297A01Ef1340A',
        isActive: true,
        network: 'sepolia'
      },
      {
        id: 'aave-weth-sepolia',
        protocol: 'Aave V3',
        token: 'WETH',
        apy: 2.1,
        tvl: '$4B',
        risk: 'Low',
        adapterAddress: '0xcee40f6aEC2b17E5b3BBB46AAdd3103C0Eb6eA46',
        isActive: true,
        network: 'sepolia'
      },
      {
        id: 'uniswap-wbtc-sepolia',
        protocol: 'Uniswap V3',
        token: 'WBTC',
        apy: 4.5,
        tvl: '$500M',
        risk: 'Medium',
        adapterAddress: '0xC53d3B458D3393dA5989285905337E94fd1f9b60',
        isActive: true,
        network: 'sepolia'
      },
      {
        id: 'aave-wbtc-sepolia',
        protocol: 'Aave V3',
        token: 'WBTC',
        apy: 1.5,
        tvl: '$1B',
        risk: 'Low',
        adapterAddress: '0x6b1A165252ADD50d3a833C628Edd36Eab0325f8e',
        isActive: true,
        network: 'sepolia'
      },
      {
        id: 'aave-usdc-sepolia',
        protocol: 'Aave V3',
        token: 'USDC',
        apy: 3.2,
        tvl: '$2B',
        risk: 'Low',
        adapterAddress: '0x6b1A165252ADD50d3a833C628Edd36Eab0325f8e',
        isActive: true,
        network: 'sepolia'
      }
    ];

    await ProtocolOption.insertMany(options);
    logger.success(`Seeded ${options.length} protocol options`, { service: 'Seed' });

    await mongoose.connection.close();
    logger.success('Database seeding completed', { service: 'Seed' });
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding error: ${error}`, { service: 'Seed' });
    process.exit(1);
  }
};

seedData();
