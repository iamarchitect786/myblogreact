# Personal Blog Platform

A modern blog platform built with React and Express, featuring a single-admin architecture with public commenting and likes.

## Prerequisites

- Node.js version 16 or later
- Git
- npm (comes with Node.js)

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
Create a `.env` file in the root directory with:
```env
ADMIN_PASSWORD=your_secure_password
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

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

If you encounter a SyntaxError when starting the application:
1. Ensure you have Node.js version 16 or later installed
2. Delete the `node_modules` folder and package-lock.json
3. Run `npm install` again
4. Start the development server with `npm run dev`

## License

MIT License