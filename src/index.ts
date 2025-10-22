import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from 'fs';
import books from './data/books.json' with { type: 'json' };
import booksDetails from './data/books-details.json' with { type: 'json' };

// Create server instance
const server = new McpServer({
  name: "book-database",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

function readJSON(file: string): any {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function formatBook(book:any): string {
  return [
    `ISBN: ${book.ISBN}`,
    `title: ${book.title}`,
    `author: ${book.author}`,
    "---",
  ].join("\n");
}
function formatBookDetails(bookDetail:any): string {
  return [
    `ISBN: ${bookDetail.ISBN}`,
    `summary: ${bookDetail.summary}`,
    `date: ${bookDetail.date}`,
    `author: ${bookDetail.author}`,
    "---",
  ].join("\n");
}

server.tool(
  "get-book-by-isbn",
  "Get book details from ISBN",
  {
    isbn: z.string().length(10).describe("The ISBN of the book to retrieve"),
  },
  async ({ isbn }) => {
    // retrieve book details from the src/data/books-details.json file
    const book = booksDetails.books.find((b:any) => b.ISBN === isbn);
    if (!book) {
      throw new Error(`Book with ISBN ${isbn} not found`);
    }
    return {
      content: [
        {
          type: "text",
          text: formatBookDetails(book),
        },
      ],
    };
  },
);

server.tool(
  "get-book-by-title",
  "Get book basic information from title",
  {
    title: z.string().describe("The title of the book to retrieve"),
  },
  async ({ title }) => {
    // retrieve book basic information from the src/data/books.json file
    const book = books.find((b:any) => b.title === title);
    if (!book) {
      throw new Error(`Book with title "${title}" not found`);
    }
    return {
      content: [
        {
          type: "text",
          text: formatBook(book),
        },
      ],
    };
  },
);

server.tool(
  "get-books-by-titles",
  "Get books basic information from a list of titles",
  {
    titles: z.array(z.string()).describe("The titles of the books to retrieve"),
  },
  async ({ titles }) => {
    // retrieve book basic information from the src/data/books.json file
    const foundBooks = books.filter((b:any) => titles.includes(b.title));
    if (foundBooks.length === 0) {
      throw new Error(`No books found for titles: ${titles.join(", ")}`);
    }
    return {
      content: foundBooks.map((book:any) => ({
        type: "text",
        text: formatBook(book),
      })),
    };
  },
);

server.tool(
  "get-books-by-isbn-list",
  "Get books details from a list of ISBNs",
  {
    isbnList: z.array(z.string().length(10)).describe("The list of ISBNs of the books to retrieve"),
  },
  async ({ isbnList }) => {
    // retrieve book basic information from the src/data/books.json file
    const foundBooks = booksDetails.books.filter((b:any) => isbnList.includes(b.ISBN));
    if (foundBooks.length === 0) {
      throw new Error(`No books found for titles: ${isbnList.join(", ")}`);
    }
    return {
      content: foundBooks.map((book:any) => ({
        type: "text",
        text: formatBookDetails(book),
      })),
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Book database MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});