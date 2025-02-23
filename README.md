# Personal Blog Platform

A modern blog platform built with React and Express, featuring a single-admin architecture with public commenting and likes.

## Prerequisites

- Node.js version 16 or later
- Git
- npm (comes with Node.js)
- VS Code (recommended)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/iamarchitect786/myblogreact.git
cd myblogreact
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Option 1: Using .env file (Recommended)
- Create a `.env` file in the root directory:
```env
ADMIN_PASSWORD=your_secure_password
```

Option 2: Using VS Code Launch Configuration
- Open `.vscode/launch.json`
- Add environment variables to the configuration:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/tsx/dist/cli.mjs",
      "args": ["server/index.ts"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "ADMIN_PASSWORD": "your_secure_password"
      }
    }
  ]
}
```

4. Running in VS Code:
- Open the project folder in VS Code
- Install recommended extensions (optional but recommended):
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
- Open integrated terminal (Ctrl+` or Cmd+`)
- Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### VS Code Debugging

To debug the application in VS Code:


2. Press F5 or use the Debug menu to start debugging

## Production Deployment

### Option 1: Deploy on Replit (Recommended)

1. Create a new Repl from your GitHub repository
2. Set the environment variables in Replit's Secrets tab:
   - Add `ADMIN_PASSWORD` with your secure password
3. Click "Run" to start the application

### Option 2: Deploy on a Traditional Server

1. Install Node.js 16 or later on your server
2. Clone the repository and install dependencies (using `npm install`)
3. Set up environment variables (using a `.env` file)
4. Build the project:
```bash
npm run build
```
5. Start the production server:
```bash
NODE_ENV=production npm start
```

The application will be available on port 5000 by default.

### Maintenance

- Regularly update dependencies using `npm update`
- Monitor server logs for any issues
- Backup your data regularly if using a persistent database


## Features

- Single admin authentication
- Blog post creation and management
- Public commenting system
- Post likes functionality
- Mobile-friendly responsive design
- Rich text editing for posts

## Development Guidelines

- Keep code clean and well-documented
- Follow the existing project structure
- Run tests before submitting changes
- Use proper error handling

## Troubleshooting

If you encounter errors when running in VS Code:

1. Ensure you have Node.js version 16 or later installed:
```bash
node --version
```

2. If you see a SyntaxError:
- Delete the `node_modules` folder and package-lock.json
- Run `npm install` again
- Start the development server with `npm run dev`

3. Port already in use:
- Kill the process using port 5000:
  - Windows: `netstat -ano | findstr :5000`
  - Mac/Linux: `lsof -i :5000`
- Or change the port in server/index.ts

4. TypeScript errors:
- Run `npm run check` to verify types
- Ensure VS Code is using the workspace version of TypeScript
  (Select TypeScript version in the bottom right when a .ts file is open)

## License

MIT License