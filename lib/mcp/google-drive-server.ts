import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { google } from "googleapis"

interface GoogleDriveConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken: string
}

class GoogleDriveServer {
  private server: Server
  private drive: any

  constructor(config: GoogleDriveConfig) {
    this.server = new Server(
      {
        name: "suitpax-google-drive",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    )

    // Initialize Google Drive API
    const oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)
    oauth2Client.setCredentials({ refresh_token: config.refreshToken })
    this.drive = google.drive({ version: "v3", auth: oauth2Client })

    this.setupHandlers()
  }

  private setupHandlers() {
    // List available resources (files and folders)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      try {
        const response = await this.drive.files.list({
          pageSize: 50,
          fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
          q: "trashed=false",
        })

        const resources = response.data.files.map((file: any) => ({
          uri: `gdrive://file/${file.id}`,
          name: file.name,
          description: `Google Drive file: ${file.name} (${file.mimeType})`,
          mimeType: file.mimeType,
        }))

        return { resources }
      } catch (error) {
        console.error("Error listing Google Drive files:", error)
        return { resources: [] }
      }
    })

    // Read file content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const fileId = request.params.uri.replace("gdrive://file/", "")

      try {
        // Get file metadata
        const metadata = await this.drive.files.get({ fileId })

        // Get file content
        const content = await this.drive.files.get({
          fileId,
          alt: "media",
        })

        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: metadata.data.mimeType,
              text: content.data,
            },
          ],
        }
      } catch (error) {
        console.error("Error reading Google Drive file:", error)
        return {
          contents: [
            {
              uri: request.params.uri,
              mimeType: "text/plain",
              text: `Error reading file: ${error}`,
            },
          ],
        }
      }
    })

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "search_files",
            description: "Search for files in Google Drive",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for files",
                },
                mimeType: {
                  type: "string",
                  description: "Filter by MIME type (optional)",
                },
              },
              required: ["query"],
            },
          },
          {
            name: "create_file",
            description: "Create a new file in Google Drive",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the file to create",
                },
                content: {
                  type: "string",
                  description: "Content of the file",
                },
                mimeType: {
                  type: "string",
                  description: "MIME type of the file",
                  default: "text/plain",
                },
              },
              required: ["name", "content"],
            },
          },
          {
            name: "upload_file",
            description: "Upload a file to Google Drive",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the file",
                },
                content: {
                  type: "string",
                  description: "Base64 encoded file content",
                },
                mimeType: {
                  type: "string",
                  description: "MIME type of the file",
                },
              },
              required: ["name", "content", "mimeType"],
            },
          },
        ],
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case "search_files":
            return await this.searchFiles(args.query, args.mimeType)
          case "create_file":
            return await this.createFile(args.name, args.content, args.mimeType)
          case "upload_file":
            return await this.uploadFile(args.name, args.content, args.mimeType)
          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${error}`,
            },
          ],
        }
      }
    })
  }

  private async searchFiles(query: string, mimeType?: string) {
    let searchQuery = `name contains '${query}' and trashed=false`
    if (mimeType) {
      searchQuery += ` and mimeType='${mimeType}'`
    }

    const response = await this.drive.files.list({
      q: searchQuery,
      fields: "files(id, name, mimeType, modifiedTime, size, webViewLink)",
    })

    const results = response.data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      modifiedTime: file.modifiedTime,
      size: file.size,
      webViewLink: file.webViewLink,
    }))

    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} files matching "${query}":\n\n${results
            .map((file) => `• ${file.name} (${file.mimeType}) - ${file.webViewLink}`)
            .join("\n")}`,
        },
      ],
    }
  }

  private async createFile(name: string, content: string, mimeType = "text/plain") {
    const response = await this.drive.files.create({
      requestBody: {
        name,
        mimeType,
      },
      media: {
        mimeType,
        body: content,
      },
    })

    return {
      content: [
        {
          type: "text",
          text: `Successfully created file "${name}" with ID: ${response.data.id}`,
        },
      ],
    }
  }

  private async uploadFile(name: string, content: string, mimeType: string) {
    const buffer = Buffer.from(content, "base64")

    const response = await this.drive.files.create({
      requestBody: {
        name,
        mimeType,
      },
      media: {
        mimeType,
        body: buffer,
      },
    })

    return {
      content: [
        {
          type: "text",
          text: `Successfully uploaded file "${name}" with ID: ${response.data.id}`,
        },
      ],
    }
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error("Suitpax Google Drive MCP server running on stdio")
  }
}

export default GoogleDriveServer
