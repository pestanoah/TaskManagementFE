# Task Management Frontend

A React-based task management application with AWS Cognito authentication and SQS integration.

## Features

- **Authentication**: AWS Cognito OIDC integration with sign-in/sign-out functionality
- **Task Management**: Create tasks with title and description
- **AWS Integration**: Sends tasks to AWS SQS queue for processing
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (using Rolldown)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Authentication**: react-oidc-context with AWS Cognito
- **AWS Services**: SQS, Cognito Identity Pool
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy to AWS S3
pnpm deploy
```

## Project Structure

```
src/
├── components/ui/     # Reusable UI components (button, input, textarea)
├── pages/            # Page components (Home)
├── lib/              # Utility functions
├── App.tsx           # Main app component with auth routing
└── main.tsx          # App entry point with OIDC provider
```
