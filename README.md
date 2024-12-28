# Medusa RBAC Plugin

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)  
[![Node](https://img.shields.io/badge/Node->=16-green.svg)](https://nodejs.org/)  
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful plugin for Medusa e-commerce that enables Role-Based Access Control (RBAC) for secure and granular permission management.

## Features

- Role-based access control for admins and users  
- Customizable roles and permissions

## TODO
- [x] Module RBAC
- [ ] Api Role/Permission/Member
    - [x] CRUD Role
    - [x] CRUD Permission
    - [ ] CRUD Member
- [ ] Admin UI
    - [ ] RBAC Settings
    - [ ] Role Settings
    - [ ] Permission Settings
    - [ ] Member Settings
- [ ] Test Suite
    - [ ] Test RBAC module
    - [ ] Test API Route


## Prerequisites

- Node.js >= 16.0.0  
- TypeScript >= 4.9.0  
- Medusa >= 2.0.0  

## Installation

1. **Install the Plugin**

```bash
npm install medusa-plugin-rbac
```

2. **Register the Module**

In your `medusa-config.js`:

```javascript
const modules = {
  // ... other modules
  brand: {
    resolve: "medusa-plugin-rbac",
    options: {
      enableUI: true,
    },
  }
}
```

3. **Run Migrations**

```bash
npx medusa migrations run
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

### Type Safety

The module is written in TypeScript with strict mode enabled and includes:

- Strict null checks
- No implicit any
- Strict property initialization
- Unused locals/parameters checks

### Error Handling

Comprehensive error handling with custom error classes:

- `ApiError` - Base API error class
- `ValidationError` - Input validation errors
- `NotFoundError` - Resource not found errors
- `BrandImageError` - Image processing errors
- `BrandValidationError` - Brand-specific validation errors

### Logging

Custom logger implementation for better debugging:

- Prefixed log messages
- Different log levels (info, warn, error)
- Stack trace for errors
- Singleton pattern for consistent logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please ensure your code:
- Passes all tests
- Follows the existing code style
- Includes appropriate documentation
- Has proper type definitions
- Handles errors appropriately

## License

MIT License

## Author

Mac Creations

## Support

For support, please open an issue in the repository or contact the maintainers.