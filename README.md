# Snake Rush Plum Orchestrator

Snake Rush Plum platformunda çalışan ERC-8004 uyumlu AI Agent. Snake rush mechanics, fast-paced gameplay automation, plum collection ve multi-level orchestration yapan dinamik orchestrator.

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

## Agent Registration & MCP Connection Guide
The application is pre-configured with active agent endpoints and a well-known agent identity card ready for agent-to-agent interaction:
- **A2A Profile:** `https://snake-rush-plum.vercel.app/.well-known/agent-card.json`
- **MCP Endpoint:** `https://snake-rush-plum.vercel.app/api/mcp`
- **Agent API:** `https://snake-rush-plum.vercel.app/api/agent`

### Capabilities
- `snake-rush-mechanics`
- `fast-paced-automation`
- `plum-collection`
- `multi-level-orchestration`
- `score-optimization`
- `survival-management`
- `mcp-command-execution`

### Connecting via MCP
The MCP (Model Context Protocol) endpoint (`/api/mcp`) accepts standard JSON-RPC HTTP POST requests. It supports:
- `initialize`: Returns the MCP server capabilities.
- `tools/list`: Lists available racing optimization tools (e.g., `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`).
- `tools/call`: Executes the requested tool.

## Web3 Implementation Details
- Uses transparent attribution for transaction submissions.
- Built for EVM-compatible chains with optimized low-latency interactions.

## Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Run local development server: `npm run dev`

## Deployment
This project is configured for Vercel Next.js deployment. Link your repository and Vercel will automatically build the environment. Ensure appropriate environment variables are set in production if any custom configurations are added later.