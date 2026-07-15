# [Project Name]

## How to setup this template (delete this section after setup)

1. If you have not done it yet, set up the topics for this repo. (See [Github repository requirements](https://cognigy.atlassian.net/wiki/spaces/Engineering/pages/edit-v2/1728905227))
2. If you have not done it yet, update the permissions of the repo on github. (See [Github repository requirements](https://cognigy.atlassian.net/wiki/spaces/Engineering/pages/edit-v2/1728905227))
 That is needed for semantic release.
3. Update the `name`, `description` and `url` inside `package.json` to match the info of this repo. That is needed for semantic release.
4. Update `CODEOWNERS` file so the repo is owned by your team.
5. Update this README file to your desire.
6. Update `CLAUDE.md` with the project overview, commands, and any repo-specific conventions so Claude Code is useful from day one in this repo. Review `.claude/settings.json` and add any project-specific commands your team wants pre-approved.

<!-- Replace [Project Name] with your actual project name -->

## Overview

<!-- Provide a brief description of what this project does and why it exists -->

This project...

## Getting Started

### Prerequisites

<!-- List any prerequisites needed to run this project -->

- Node.js >= 18.x (or specify your requirements)
- Docker (if applicable)
- Access to Cognigy internal resources

### Installation

<!-- Provide step-by-step installation instructions -->

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd [project-name]

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Configuration

<!-- Describe any configuration needed -->

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```
   # Add your configuration variables here
   ```

### Running the Project

<!-- Provide instructions to run the project -->

```bash
# Development mode
npm run dev

# Production build
npm run build

# Run tests
npm test
```

## Project Structure

<!-- Describe the main directories and their purposes -->

```
.
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Additional documentation
└── config/        # Configuration files
```

## Testing

<!-- Explain how to run tests -->

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Contributing

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation. Please follow the commit message format described in [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md).

**Quick reference:**
- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (major version bump)
- `docs:`, `chore:`, `test:`, `ci:` - No version bump

### Releases

Releases are automated using [semantic-release](https://github.com/semantic-release/semantic-release). When commits are pushed to the `main` branch:
1. The version number is automatically determined based on commit messages
2. A changelog is generated and committed
3. A GitHub release is created
4. Tags are created automatically

## Dependabot Auto-Merge

This template includes automatic merging for Dependabot PRs when all CI checks pass.

| Update Type | Default | Action |
|-------------|---------|--------|
| **Patch** | ✅ Enabled | Auto-merged |
| **Minor** | ❌ Disabled | Opt-in |
| **Major** | ❌ Disabled | Opt-in (use with caution) |

📖 **[Full Setup Guide](.github/DEPENDABOT_AUTO_MERGE.md)** - How to enable auto-merge for your repository

## Documentation

<!-- Link to additional documentation -->

- [Architecture Documentation](docs/architecture.md) (if applicable)
- [API Documentation](docs/api.md) (if applicable)
- [Deployment Guide](docs/deployment.md) (if applicable)

**Note:** This README is a template. Please customize it for your specific project needs.