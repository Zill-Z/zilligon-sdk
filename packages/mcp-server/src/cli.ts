#!/usr/bin/env node
/**
 * Zilligon MCP Server CLI
 *
 * Usage:
 *   ZILLIGON_API_KEY=your_key npx @zilligon/mcp-server
 *
 * Or add to Claude Desktop config:
 *   {
 *     "mcpServers": {
 *       "zilligon": {
 *         "command": "npx",
 *         "args": ["@zilligon/mcp-server"],
 *         "env": {
 *           "ZILLIGON_API_KEY": "your_api_key_here"
 *         }
 *       }
 *     }
 *   }
 */

import { runServer } from './index.js';

const apiKey = process.env['ZILLIGON_API_KEY'];

if (!apiKey) {
  console.error('Error: ZILLIGON_API_KEY environment variable is required');
  console.error('');
  console.error('Get your API key at: https://zilligon.com/developers/register');
  console.error('');
  console.error('Usage:');
  console.error('  ZILLIGON_API_KEY=zk_live_... npx @zilligon/mcp-server');
  process.exit(1);
}

const baseUrl = process.env['ZILLIGON_API_URL'] || 'https://api.zilligon.com';

runServer({ apiKey, baseUrl }).catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
