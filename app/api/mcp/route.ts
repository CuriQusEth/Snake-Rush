import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      protocol: "MCP",
      version: "1.0.0",
      name: "Snake Rush Plum MCP Endpoint",
      status: "active",
      description: "Active MCP server for Snake Rush Plum Orchestrator Agent",
      capabilities: [
        "snake-rush-mechanics",
        "fast-paced-automation",
        "plum-collection"
      ],
      skills: [
        { name: "get_race_status", description: "Get the current status of the Snake Rush race" },
        { name: "start_race", description: "Initialize and start a new Snake Rush race" },
        { name: "get_leaderboard", description: "Retrieve the current top rushers leaderboard" },
        { name: "optimize_speed", description: "Optimize snake speed and automation parameters" },
        { name: "get_track_info", description: "Get current arena track and hazard information" }
      ],
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params } = body;

    let result = null;

    if (method === 'initialize') {
      result = {
        protocolVersion: "2024-11-05",
        serverInfo: {
          name: "Snake Rush Plum Orchestrator",
          version: "1.0.0",
        },
        capabilities: {
          tools: {},
          prompts: {},
          resources: {}
        }
      };
    } else if (method === 'tools/list') {
      result = {
        tools: [
          {
            name: "get_race_status",
            description: "Get the current status of the Snake Rush race",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "start_race",
            description: "Initialize and start a new Snake Rush race",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_leaderboard",
            description: "Retrieve the current top rushers leaderboard",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "optimize_speed",
            description: "Optimize snake speed and automation parameters",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_track_info",
            description: "Get current arena track and hazard information",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      };
    } else if (method === 'tools/call') {
      const toolName = params?.name;
      
      switch (toolName) {
        case "get_race_status":
          result = { content: [{ type: "text", text: "Race status retrieved: Active" }] };
          break;
        case "start_race":
          result = { content: [{ type: "text", text: "New race initialized successfully" }] };
          break;
        case "get_leaderboard":
          result = { content: [{ type: "text", text: "Leaderboard data fetched" }] };
          break;
        case "optimize_speed":
          result = { content: [{ type: "text", text: "Speed optimization applied" }] };
          break;
        case "get_track_info":
          result = { content: [{ type: "text", text: "Track Info: Standard Arena" }] };
          break;
        default:
          throw new Error(`Tool not found: ${toolName}`);
      }
    } else if (method === 'prompts/list') {
      result = { prompts: [] };
    } else if (method === 'resources/list') {
      result = { resources: [] };
    } else {
      result = {
        status: "success",
        message: "MCP command received",
        agent: "Snake Rush Plum Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      };
    }

    const responseBody = body.id ? { jsonrpc: "2.0", id: body.id, result } : result;

    return NextResponse.json(responseBody, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid MCP request" }, 
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
