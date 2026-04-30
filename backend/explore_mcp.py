# explore_mcp.py
import asyncio

from app_mcp.server import order_server


async def explore():
    print("Connecting to Order MCP…", flush=True)
    async with order_server:
        tools = await order_server.list_tools()
        print(f"Found {len(tools)} tool(s).\n", flush=True)
        for tool in tools:
            print(f"Tool: {tool.name}")
            print(f"Description: {tool.description}")
            print(f"Input schema: {tool.inputSchema}")
            print("---")


if __name__ == "__main__":
    asyncio.run(explore())
