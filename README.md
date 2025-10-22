# Book Database MCP Server

> [!NOTE]
> This is a small MCP (Model Context Protocol) demo server used during the GitHub Copilot Agents and MCP training sessions. It used by a demo explained in the [copilot-agent-and-mcp](https://github.com/ps-copilot-sandbox/copilot-agent-and-mcp) repository.

## Functional

Book Database MCP Server exposes a simple set of tools that let an MCP-capable agent or client query a curated book database. Key features:
- Retrieve a book's basic information (ISBN, title, author) by title.
- Retrieve detailed book information (summary, date, author) by ISBN.
- Batch queries: request multiple books by a list of titles or ISBNs.
- Uses small JSON files as the backing dataset (easy to read and modify for demos).

## Technical

- Runtime: Node.js (TypeScript source in `src/`).
- Protocol: Model Context Protocol (MCP) using `@modelcontextprotocol/sdk`.
- Transport: Standard I/O transport (`StdioServerTransport`) — this server communicates over stdio.
- Validation: Input schemas are validated with `zod` for each tool.
- Data: `src/data/books.json` (basic list) and `src/data/books-details.json` (summaries and dates).
- Tools implemented in `src/index.ts`:
  - `get-book-by-isbn` — takes `isbn: string` (10 chars)
  - `get-book-by-title` — takes `title: string`
  - `get-books-by-titles` — takes `titles: string[]`
  - `get-books-by-isbn-list` — takes `isbnList: string[]` (10-char items)

## Setup

**Prerequisites:** Node.js (18+ recommended) and npm.

1. Clone the repository and enter the demo folder:

```bash
git clone <repo-url>
cd <repo-root>
```

2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript sources:

```bash
npm run build
```

The build produces `build/index.js` and the `build` folder is listed in package.json `files`.

## Run

Start the MCP server (it runs on stdio and writes a startup log to stderr):

```bash
node build/index.js
```

When running successfully you should see an informational message on stderr similar to:

```log
Book database MCP Server running on stdio
```

You don't need to start the server manually during the demo as it will be started by the [MCP server configuration in the webapp demo repository](https://github.com/ps-copilot-sandbox/copilot-agent-and-mcp/blob/sparlant/update-demo-workshop-instructions/.vscode/mcp.json).

## Usage examples

The server exposes the tool names listed above. Example calls (conceptual):

- Get details by ISBN:
  - Tool: `get-book-by-isbn`
  - Input: `{ "isbn": "0451524935" }`  # returns details for "1984"

- Get basic info by title:
  - Tool: `get-book-by-title`
  - Input: `{ "title": "The Hobbit" }`

- Batch lookup by titles:
  - Tool: `get-books-by-titles`
  - Input: `{ "titles": ["1984", "Brave New World"] }`

## Data

The datasets are small JSON files in `src/data/` so you can easily tweak entries during a workshop:
- `src/data/books.json` — array of simple book objects (ISBN, title, author)
- `src/data/books-details.json` — object with a `books` array containing summaries and dates

## Notes

- This project is intentionally small and focused on demonstrating how to serve tools over MCP.
- If you want to interactively test tools locally, write a tiny Node client that uses `StdioClientTransport` from `@modelcontextprotocol/sdk` and spawn this server as a child process so their stdio streams are connected.
