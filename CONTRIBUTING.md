# Contributing to aws-step-function-tester

Thank you for your interest in contributing to aws-step-function-tester! We welcome contributions from the community and are pleased to have you join us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Recognition](#recognition)

## Code of Conduct

This project and everyone participating in it is expected to uphold our commitment to fostering an open and welcoming environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected to see**
- **Include your environment details** (Node.js version, AWS SDK version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any examples of how it would be used**

### Your First Code Contribution

Unsure where to begin? You can start by looking through issues labeled as:
- `good first issue` - issues that should only require a few lines of code
- `help wanted` - issues that may be more involved

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Test your changes** - ensure all tests pass
4. **Update documentation** if needed
5. **Write a clear commit message**
6. **Submit a pull request**

Please follow these guidelines for pull requests:

- Include a clear description of the problem and solution
- Reference any related issues
- Include tests for new functionality
- Ensure the build passes
- Keep pull requests focused on a single issue/feature

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/xanderhub/aws-step-function-tester.git
   cd aws-step-function-tester
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- AWS account and credentials configured for testing
- TypeScript knowledge

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

### TypeScript Style Guide

- Follow the existing code style in the project
- Use TypeScript features appropriately
- Include JSDoc comments for public APIs
- Write meaningful variable and function names
- Keep functions focused and single-purpose

### Testing Guidelines

- Write tests for new functionality
- Ensure existing tests pass before submitting PR
- Follow the existing test structure using Cucumber
- Mock external AWS services when appropriate

## Recognition

Contributors who submit merged pull requests will be recognized in our Contributors section. We use the [all-contributors](https://github.com/all-contributors/all-contributors) specification to acknowledge contributions of all kinds.

To add yourself as a contributor, you can:
1. Comment on your PR or issue with: `@all-contributorsbot please add @username for code`
2. Or we'll add you manually after your contribution is merged

Contribution types include:
- 💻 Code
- 📖 Documentation
- 🐛 Bug reports
- 💡 Ideas & Planning
- 🤔 Answering Questions
- ⚠️ Tests
- And more!

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
