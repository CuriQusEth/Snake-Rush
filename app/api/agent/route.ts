import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: "Snake Rush Plum Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Snake Rush Plum",
      version: "1.0.0",
      capabilities: [
        "snake-rush-mechanics",
        "fast-paced-automation",
        "plum-collection",
        "multi-level-orchestration",
        "score-optimization",
        "survival-management",
        "mcp-command-execution"
      ],
      skills: [
        { name: "get_race_status", description: "Get the current status of the Snake Rush race" },
        { name: "start_race", description: "Initialize and start a new Snake Rush race" },
        { name: "get_leaderboard", description: "Retrieve the current top rushers leaderboard" },
        { name: "optimize_speed", description: "Optimize snake speed and automation parameters" },
        { name: "get_track_info", description: "Get current arena track and hazard information" }
      ]
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
    return NextResponse.json(
      {
        name: "Snake Rush Plum Orchestrator",
        status: "active",
        wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
        platform: "Snake Rush Plum",
        version: "1.0.0",
        message: "Agent endpoint parsed POST body successfully",
        payload: body
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid Request" },
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
