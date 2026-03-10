/**
 * Figma MCP Configuration
 * 
 * Note: The Figma plugin auto-generates channel IDs (e.g., "onmuuj5k")
 * There's no manual channel input in the plugin UI.
 * 
 * Workflow:
 * 1. Plugin connects and shows auto-generated channel ID
 * 2. Use that channel ID when connecting from Cursor via join_channel tool
 * 3. Or use join_channel with a custom name - plugin may need to reconnect
 */

export const FIGMA_CONFIG = {
  /**
   * Channel name for Figma MCP connection
   * 
   * Since the plugin auto-generates IDs, you have two options:
   * 1. Use the auto-generated channel ID shown in plugin (e.g., "onmuuj5k")
   * 2. Use join_channel tool with a custom name like "goldsmith"
   * 
   * The plugin will use whatever channel is active when you connect.
   */
  CHANNEL_NAME: 'goldsmith', // Try using this, or use the auto-generated ID from plugin
} as const;
