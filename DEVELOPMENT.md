# Development Guide

## Development Setup

### Prerequisites
- Node.js v16+
- MongoDB v4.4+
- npm or yarn

### Environment Variables

Create `.env` file in `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sawit_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Running Development Servers

#### Option 1: Run Both Together
```bash
npm run dev
```

#### Option 2: Run Separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Project Structure

```
essawit/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── context/      # React context
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app
│   └── public/           # Static files
└── docs/                 # Documentation
```

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Use camelCase for variables and functions
- Use PascalCase for components
- Use descriptive names
- Keep functions small and focused
- Add comments for complex logic

### Naming Conventions
- Components: `PascalCase` (e.g., `UserProfile`)
- Functions: `camelCase` (e.g., `getUserData`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS`)
- Files: Match component/function name

### File Organization
- One component per file
- Group related files in folders
- Use index.js for exports when needed
- Keep imports organized (external, internal, relative)

### Error Handling
- Always use try-catch for async operations
- Use Error Boundary for React errors
- Provide meaningful error messages
- Log errors appropriately
- Handle edge cases

### Testing
- Write tests for utilities
- Write tests for hooks
- Write tests for components
- Write integration tests
- Aim for >80% code coverage

## Git Workflow

### Branch Naming
- `main` - Production ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `hotfix/issue-name` - Hot fixes

### Commit Messages
Follow conventional commits:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor code`
- `test: Add tests`
- `chore: Update dependencies`

### Pull Requests
- Create PR for all changes
- Add description of changes
- Link related issues
- Request review before merging
- Ensure tests pass
- Ensure no linting errors

## Code Review Checklist

- [ ] Code follows style guide
- [ ] No console.logs or debug code
- [ ] Error handling is proper
- [ ] Security best practices followed
- [ ] Performance considered
- [ ] Accessibility considered
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Edge cases handled

## Debugging

### Backend
```bash
# Enable debug mode
NODE_ENV=development npm run dev

# Check MongoDB connection
mongosh
```

### Frontend
```bash
# Enable React DevTools
# Install browser extension

# Check network requests
# Use browser DevTools Network tab
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Use useMemo/useCallback for expensive computations
- Lazy load routes
- Optimize images
- Minimize bundle size
- Use code splitting

### Backend
- Add database indexes
- Optimize queries
- Use pagination
- Cache frequently accessed data
- Compress responses
- Rate limit APIs

## Security Best Practices

- Never commit secrets to git
- Validate all inputs
- Sanitize outputs
- Use HTTPS in production
- Keep dependencies updated
- Use parameterized queries
- Implement proper authentication
- Rate limit APIs
- Use security headers

## Deployment Checklist

- [ ] Update version number
- [ ] Update CHANGELOG.md
- [ ] Run all tests
- [ ] Build frontend
- [ ] Check environment variables
- [ ] Database migrations (if any)
- [ ] Update documentation
- [ ] Backup database
- [ ] Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor logs
- [ ] Verify deployment

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string
- Check firewall settings

**Port Already in Use**
- Change port in .env
- Kill process using port: `lsof -ti:5000 | xargs kill`

**Module Not Found**
- Delete node_modules
- Delete package-lock.json
- Run npm install

**CORS Error**
- Check FRONTEND_URL in backend .env
- Verify CORS settings

## Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Query Documentation](https://tanstack.com/query)

