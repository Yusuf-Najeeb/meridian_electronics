from agents.mcp import (
    MCPServerStdio,
    MCPServerStreamableHttp,
    MCPServerStreamableHttpParams,
)

filesystem_server = MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
    },
    client_session_timeout_seconds=120,
    max_retry_attempts=5,
)

order_server = MCPServerStreamableHttp(
    params=MCPServerStreamableHttpParams(
        url="https://order-mcp-74afyau24q-uc.a.run.app/mcp",
    ),
    client_session_timeout_seconds=120,
    max_retry_attempts=5,
)