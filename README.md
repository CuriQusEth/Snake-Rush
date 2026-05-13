# Snake Rush

Snake Rush is a fast, intense, and modern reimagining of the classic Snake game, built with on-chain mechanics and agent integrations. Play, survive, and record your rushes.

## Overview
Control a high-speed neon snake rushing through dynamic arenas. Eat energy orbs, dodge hazards, and survive as long as possible while building massive combos. The game accelerates continuously—true to the "Rush" name.

## Features
- **High-Speed Gameplay**: The longer you survive, the faster your snake becomes.
- **On-Chain Leaderboards**: Track your highest score and longest survival.
- **ERC-8004 Agent Orchestration**: Features a `.well-known/agent-card.json` identity and `MCP`/`Agent` APIs ready for AI agent discovery and interaction.
- **SIWE Integration**: Players sign their scores securely before recording them.
- **Cyberpunk Aesthetic**: High-energy neon visuals, immersive particle effects, and a highly responsive `canvas` engine.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Framer Motion
- Web3: Wagmi + Viem
- AI Agent Standard: ERC-8004 + MCP

## Agent Configuration
The application is pre-configured with agent endpoints and a well-known agent identity card (`agent-card.json`). The agent endpoints handle Model Context Protocol (MCP) and inter-agent queries seamlessly via `/api/mcp` and `/api/agent`.

## Web3 Implementation Details
- Uses transparent attribution for transaction submissions.
- Built for EVM-compatible chains with optimized low-latency interactions.

## Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Run local development server: `npm run dev`

## Deployment
This project is configured for Vercel deployment. Link your repository and Vercel will automatically build the environment. Ensure appropriate environment variables are set in production if any custom configurations are added later.