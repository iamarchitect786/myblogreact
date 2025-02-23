# Personal Blog Platform

A modern blog platform built with React and Express, featuring a single-admin architecture with public commenting and likes.

## Features

- Single admin authentication
- Blog post creation and management
- Public commenting system
- Post likes functionality
- Mobile-friendly responsive design
- Rich text editing for posts

## Production Deployment Guide

### Prerequisites

1. Node.js (v18 or later)
2. Git
3. A hosting platform (e.g., Vercel, Heroku, or DigitalOcean)

### Environment Variables

Set up the following environment variables in your production environment:

```env
ADMIN_PASSWORD=your_secure_password
```

### Deployment Steps

#### Option 1: Deploy on Vercel (Recommended)

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Set the environment variables in Vercel's dashboard
5. Deploy

#### Option 2: Deploy on a Traditional Server

1. Clone the repository:
```bash
git clone https://github.com/iamarchitect786/myblogreact.git
cd myblogreact
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the production server:
```bash
NODE_ENV=production npm start
```

The application will be available on port 5000 by default.

### Maintenance

- Regularly update dependencies using `npm update`
- Monitor server logs for any issues
- Backup your data regularly if using a persistent database

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:5000`

## License

MIT License