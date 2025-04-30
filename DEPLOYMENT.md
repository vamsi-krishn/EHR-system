# Deployment Guide for EHR - Blockchain Medical Record

This document provides instructions for deploying the EHR Blockchain Medical Record system to various environments.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or another Ethereum wallet
- Access to an Ethereum network (mainnet, testnet, or local development network)

## Local Deployment

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/ehr-blockchain.git
   cd ehr-blockchain
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment with Vercel

1. Push your code to a GitHub repository.

2. Sign up for a [Vercel account](https://vercel.com/signup) if you don't have one.

3. Create a new project in Vercel and import your GitHub repository.

4. Configure the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: The address of your deployed smart contract
   - `NEXT_PUBLIC_NETWORK_ID`: The ID of the Ethereum network you're using

5. Deploy the project.

## Smart Contract Deployment

1. Install Truffle globally:
   \`\`\`bash
   npm install -g truffle
   \`\`\`

2. Compile the smart contracts:
   \`\`\`bash
   truffle compile
   \`\`\`

3. Configure your deployment network in `truffle-config.js`.

4. Deploy the contracts:
   \`\`\`bash
   truffle migrate --network <network-name>
   \`\`\`

5. Note the contract address and update the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable.

## Maintenance

- Regularly update dependencies to ensure security and performance.
- Monitor smart contract events and transactions.
- Implement a backup strategy for critical data.

## Troubleshooting

- If you encounter issues with MetaMask connectivity, ensure that the user has the correct network selected.
- For contract interaction issues, verify that the ABI and contract address are correct.
- Check browser console logs for JavaScript errors.
