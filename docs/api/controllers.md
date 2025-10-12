# CRUD Controllers Implementation

## Overview

This document outlines the CRUD (Create, Read, Update, Delete) controllers that have been implemented for the Comics Tracker API.

## Controllers Created

### 1. Comics Controller (`/api/controllers/comics.ts`)

**Route:** `/comics`

**Endpoints:**

- `GET /comics` - Get all comics
- `GET /comics/:id` - Get a specific comic by ID
- `POST /comics` - Create a new comic
- `PUT /comics/:id` - Update an existing comic
- `DELETE /comics/:id` - Delete a comic

**Required Fields:** `title`, `author`

---

### 2. Publishers Controller (`/api/controllers/publishers.ts`)

**Route:** `/publishers`

**Endpoints:**

- `GET /publishers` - Get all publishers
- `GET /publishers/:id` - Get a specific publisher by ID
- `POST /publishers` - Create a new publisher
- `PUT /publishers/:id` - Update an existing publisher
- `DELETE /publishers/:id` - Delete a publisher

**Required Fields:** `name`

---

### 3. Universes Controller (`/api/controllers/universes.ts`)

**Route:** `/universes`

**Endpoints:**

- `GET /universes` - Get all universes
- `GET /universes/:id` - Get a specific universe by ID
- `POST /universes` - Create a new universe
- `PUT /universes/:id` - Update an existing universe
- `DELETE /universes/:id` - Delete a universe

**Required Fields:** `name`

---

### 4. Creators Controller (`/api/controllers/creators.ts`)

**Route:** `/creators`

**Endpoints:**

- `GET /creators` - Get all creators
- `GET /creators/:id` - Get a specific creator by ID
- `POST /creators` - Create a new creator
- `PUT /creators/:id` - Update an existing creator
- `DELETE /creators/:id` - Delete a creator

**Required Fields:** `name`, `creatorType` (ARTIST or AUTHOR)

**Validation:** creatorType must be either 'ARTIST' or 'AUTHOR'

---

### 5. Runs Controller (`/api/controllers/runs.ts`)

**Route:** `/runs`

**Endpoints:**

- `GET /runs` - Get all comic runs
- `GET /runs/:id` - Get a specific run by ID
- `POST /runs` - Create a new run
- `PUT /runs/:id` - Update an existing run
- `DELETE /runs/:id` - Delete a run

**Required Fields:** `seriesName`

**Optional Fields:** `keyAuthorId`, `keyArtistId`, `startDate`, `endDate`, `startIssue`, `endIssue`, `description`, `universeId`

---

### 6. Omnibus Controller (`/api/controllers/omnibus.ts`)

**Route:** `/omnibus`

**Endpoints:**

- `GET /omnibus` - Get all omnibus editions
- `GET /omnibus/:id` - Get a specific omnibus by ID
- `POST /omnibus` - Create a new omnibus edition
- `PUT /omnibus/:id` - Update an existing omnibus
- `DELETE /omnibus/:id` - Delete an omnibus

**Required Fields:** `title`

**Optional Fields:** `coverImageUrl`, `publicationDate`, `isbn`, `description`, `pageCount`, `publisher`, `volume`

---

### 7. Trade Paperbacks Controller (`/api/controllers/tradePaperbacks.ts`)

**Route:** `/trade-paperbacks`

**Endpoints:**

- `GET /trade-paperbacks` - Get all trade paperbacks
- `GET /trade-paperbacks/:id` - Get a specific trade paperback by ID
- `POST /trade-paperbacks` - Create a new trade paperback
- `PUT /trade-paperbacks/:id` - Update an existing trade paperback
- `DELETE /trade-paperbacks/:id` - Delete a trade paperback

**Required Fields:** `title`

**Optional Fields:** `coverImageUrl`, `publicationDate`, `isbn`, `description`, `pageCount`, `publisher`, `volume`

---

### 8. Users Controller (`/api/controllers/users.ts`)

**Route:** `/users`

**Endpoints:**

- `GET /users` - Get all users (excludes password and sensitive fields)
- `GET /users/:id` - Get a specific user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user's information
- `DELETE /users/:id` - Delete a user
- `GET /users/:id/roles` - Get all roles assigned to a user
- `POST /users/:id/roles` - Assign a role to a user
- `DELETE /users/:id/roles/:roleId` - Remove a role from a user
- `POST /users/:id/change-password` - Change a user's password

**Required Fields for Creation:** `username`, `email`, `password`

**Security Features:**

- Passwords are hashed using bcrypt with salt rounds
- Sensitive fields (passwordHash, resetPasswordToken, resetPasswordExpires) are excluded from all responses
- Password change requires current password verification

---

### 9. Permissions Controller (`/api/controllers/permissions.ts`)

**Route:** `/permissions`

**Endpoints:**

- `GET /permissions` - Get all permissions ordered by resource and action
- `GET /permissions/by-resource` - Get permissions grouped by resource type
- `GET /permissions/:id` - Get a specific permission by ID
- `POST /permissions` - Create a new permission
- `PUT /permissions/:id` - Update a permission
- `DELETE /permissions/:id` - Delete a permission

**Required Fields:** `name`, `resource`, `action`

**Optional Fields:** `description`

**Permission Format:** Permissions follow the format `resource:action` (e.g., `comics:create`, `users:read`)

---

### 10. Roles Controller (`/api/controllers/roles.ts`)

**Route:** `/roles`

**Endpoints:**

- `GET /roles` - Get all roles ordered by name
- `GET /roles/:id` - Get a specific role by ID
- `POST /roles` - Create a new role
- `PUT /roles/:id` - Update a role
- `DELETE /roles/:id` - Delete a role
- `GET /roles/:id/permissions` - Get all permissions assigned to a role
- `POST /roles/:id/permissions` - Assign a permission to a role
- `DELETE /roles/:id/permissions/:permissionId` - Remove a permission from a role
- `POST /roles/:id/permissions/bulk` - Assign multiple permissions to a role at once

**Required Fields:** `name`

**Optional Fields:** `description`

**RBAC Features:**

- Roles can have multiple permissions
- Bulk permission assignment for efficient role setup
- Prevents duplicate permission assignments
- Returns count of assigned and skipped permissions in bulk operations

---

## Common Features

All controllers include:

- ✅ Full CRUD operations
- ✅ Comprehensive Swagger/OpenAPI documentation
- ✅ Input validation
- ✅ Error handling with appropriate HTTP status codes
- ✅ Logging via Winston logger
- ✅ Consistent response formats
- ✅ 404 handling for non-existent resources
- ✅ 400 handling for invalid input
- ✅ 500 handling for server errors

## Routes Registration

All controllers have been registered in `/api/app.ts`:

```typescript
app.use('/auth', authRouter);
app.use('/comics', comicsRouter);
app.use('/publishers', publishersRouter);
app.use('/universes', universesRouter);
app.use('/creators', creatorsRouter);
app.use('/runs', runsRouter);
app.use('/omnibus', omnibusRouter);
app.use('/trade-paperbacks', tradePaperbacksRouter);
app.use('/users', usersRouter);
app.use('/permissions', permissionsRouter);
app.use('/roles', rolesRouter);
```

## Testing the API

1. Start the server:

   ```bash
   cd api
   npm run dev
   ```

2. Access Swagger documentation at: `http://localhost:3000/api-docs`

3. Test endpoints using:
   - Swagger UI (interactive documentation)
   - curl commands
   - Postman
   - Any HTTP client

## Example Usage

### Creating a Comic

```bash
curl -X POST http://localhost:3000/comics \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Amazing Spider-Man #1",
    "author": "Stan Lee",
    "description": "First appearance of Spider-Man",
    "pages": 32,
    "publisher": "Marvel Comics",
    "publishedDate": "1963-03-01"
  }'
```

### Getting All Comics

```bash
curl http://localhost:3000/comics
```

### Getting a Specific Comic

```bash
curl http://localhost:3000/comics/1
```

### Updating a Comic

```bash
curl -X PUT http://localhost:3000/comics/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Amazing Spider-Man #1 (Updated)",
    "author": "Stan Lee",
    "pages": 32
  }'
```

### Deleting a Comic

```bash
curl -X DELETE http://localhost:3000/comics/1
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input or missing required fields
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## RBAC System

The Users, Permissions, and Roles controllers implement a comprehensive Role-Based Access Control (RBAC) system:

### Permission Structure

- **Format:** `resource:action` (e.g., `comics:create`, `users:delete`)
- **Resources:** comics, creators, publishers, universes, runs, omnibuses, tradePaperbacks, users, roles, permissions, system
- **Actions:** create, read, update, delete, list, plus special actions (e.g., `users:resetPassword`, `roles:assignPermissions`)

### Predefined Roles

1. **Admin** - Full access to all resources (61 permissions)
2. **Editor** - Full content management (39 permissions)
3. **Contributor** - Create and read content (21 permissions)
4. **Reader** - Read-only access (14 permissions)
5. **Moderator** - User and content moderation (34 permissions)

### RBAC Examples

**Get all roles:**

```bash
curl http://localhost:3000/roles
```

**Assign a role to a user:**

```bash
curl -X POST http://localhost:3000/users/1/roles \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2}'
```

**Get user's roles:**

```bash
curl http://localhost:3000/users/1/roles
```

**Assign permissions to a role:**

```bash
curl -X POST http://localhost:3000/roles/3/permissions \
  -H "Content-Type: application/json" \
  -d '{"permissionId": 5}'
```

**Bulk assign permissions:**

```bash
curl -X POST http://localhost:3000/roles/3/permissions/bulk \
  -H "Content-Type: application/json" \
  -d '{"permissionIds": [1, 2, 3, 5, 8, 13]}'
```

**Get permissions grouped by resource:**

```bash
curl http://localhost:3000/permissions/by-resource
```

## Testing

All controllers include comprehensive unit tests located in `/api/__tests__/controllers/`:

- `users.test.ts` - Users controller tests (350+ lines, 20+ test cases)
- `permissions.test.ts` - Permissions controller tests (250+ lines, 15+ test cases)
- `roles.test.ts` - Roles controller tests (400+ lines, 25+ test cases)

Run tests with:

```bash
cd api
npm test
```

## Next Steps

Consider adding:

- **Authentication/authorization middleware** - Verify JWT tokens and check permissions before allowing access
- **Permission checking middleware** - Enforce RBAC rules on protected endpoints
- Pagination for GET all endpoints
- Filtering and sorting capabilities
- Relationship endpoints (e.g., get all comics for a specific universe)
- Input sanitization
- Rate limiting
- Caching
- Database transactions for complex operations
- **Audit logging** - Track all RBAC changes (role assignments, permission modifications)
