export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
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
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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
            return res.status(404).json({ error: `Tool not found: ${toolName}` });
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
      return res.status(200).json(responseBody);
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
