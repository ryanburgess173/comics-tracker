# Permissions System Documentation

**Last Updated:** October 12, 2025

This document details the comprehensive permissions system implemented for the Comics Tracker application.

## Overview

The permissions system uses a role-based access control (RBAC) model with granular permissions for each resource and action combination.

## Permissions Structure

Each permission has:

- **name**: Unique identifier in format `resource:action`
- **description**: Human-readable description
- **resource**: The model/table being accessed
- **action**: The operation being performed

## Resources

The system defines permissions for the following resources:

1. **comics** - Comic books and issues
2. **creators** - Comic book creators (authors/artists)
3. **publishers** - Comic book publishers
4. **universes** - Comic book universes/continuities
5. **runs** - Comic book series runs
6. **omnibuses** - Omnibus collections
7. **tradePaperbacks** - Trade paperback collections
8. **users** - System users
9. **roles** - User roles
10. **permissions** - System permissions
11. **system** - System-level operations

## Standard Actions

Each major resource has these standard CRUD actions:

- **create** - Create new records
- **read** - View/read individual records
- **update** - Modify existing records
- **delete** - Remove records
- **list** - Browse/list all records

## Complete Permissions List

### Comics Permissions (5)

- `comics:create` - Create new comic records
- `comics:read` - View comic details
- `comics:update` - Update comic information
- `comics:delete` - Delete comics
- `comics:list` - Browse all comics

### Creators Permissions (5)

- `creators:create` - Add new creators
- `creators:read` - View creator details
- `creators:update` - Update creator information
- `creators:delete` - Remove creators
- `creators:list` - Browse all creators

### Publishers Permissions (5)

- `publishers:create` - Add new publishers
- `publishers:read` - View publisher details
- `publishers:update` - Update publisher information
- `publishers:delete` - Remove publishers
- `publishers:list` - Browse all publishers

### Universes Permissions (5)

- `universes:create` - Create new universes
- `universes:read` - View universe details
- `universes:update` - Update universe information
- `universes:delete` - Remove universes
- `universes:list` - Browse all universes

### Runs Permissions (5)

- `runs:create` - Create new series runs
- `runs:read` - View run details
- `runs:update` - Update run information
- `runs:delete` - Remove runs
- `runs:list` - Browse all runs

### Omnibuses Permissions (7)

- `omnibuses:create` - Create new omnibus collections
- `omnibuses:read` - View omnibus details
- `omnibuses:update` - Update omnibus information
- `omnibuses:delete` - Remove omnibuses
- `omnibuses:list` - Browse all omnibuses
- `omnibuses:addComics` - Add comics to omnibus collections
- `omnibuses:removeComics` - Remove comics from omnibus collections

### Trade Paperbacks Permissions (7)

- `tradePaperbacks:create` - Create new TPB collections
- `tradePaperbacks:read` - View TPB details
- `tradePaperbacks:update` - Update TPB information
- `tradePaperbacks:delete` - Remove TPBs
- `tradePaperbacks:list` - Browse all TPBs
- `tradePaperbacks:addComics` - Add comics to TPB collections
- `tradePaperbacks:removeComics` - Remove comics from TPB collections

### Users Permissions (8)

- `users:create` - Create new user accounts
- `users:read` - View user details
- `users:update` - Update user information
- `users:delete` - Delete user accounts
- `users:list` - Browse all users
- `users:resetPassword` - Reset user passwords
- `users:changeRole` - Change user roles
- `users:activate` - Activate/deactivate user accounts

### Roles Permissions (6)

- `roles:create` - Create new roles
- `roles:read` - View role details
- `roles:update` - Update role information
- `roles:delete` - Remove roles
- `roles:list` - Browse all roles
- `roles:assignPermissions` - Assign permissions to roles

### Permissions Permissions (5)

- `permissions:create` - Create new permissions
- `permissions:read` - View permission details
- `permissions:update` - Update permission information
- `permissions:delete` - Remove permissions
- `permissions:list` - Browse all permissions

### System Permissions (3)

- `system:viewLogs` - View system logs
- `system:manageSettings` - Manage system settings
- `system:backup` - Create system backups

## Roles

The system includes five predefined roles with different permission levels:

### 1. Admin (61 permissions)

**Description:** Full system access with all permissions

**Access Level:** Complete unrestricted access to all resources and actions

### 2. Editor (39 permissions)

**Description:** Can create, read, update comics, creators, publishers, and collections

**Has Full CRUD Access To:**

- Comics
- Creators
- Publishers
- Universes
- Runs
- Omnibuses
- Trade Paperbacks
- Collection management (add/remove comics)

**Cannot:**

- Manage users, roles, or permissions
- Access system-level operations

### 3. Contributor (21 permissions)

**Description:** Can create and read content, but not delete

**Can:**

- Create and view comics
- Create and view creators
- View publishers and universes
- Create and view runs
- Create and view collections
- Add comics to collections

**Cannot:**

- Delete any content
- Update publishers or universes
- Remove comics from collections
- Manage users or system

### 4. Reader (14 permissions)

**Description:** Read-only access to view comics and collections

**Can:**

- View all content (read + list)
- Browse comics, creators, publishers, universes, runs, collections

**Cannot:**

- Create, update, or delete anything
- Manage users or system

### 5. Moderator (34 permissions)

**Description:** Can manage users and moderate content

**Can:**

- Manage users (create, read, update, list, reset passwords, activate/deactivate)
- Moderate all content (read, update, delete, list)
- Remove inappropriate content

**Cannot:**

- Create new content (focused on moderation)
- Manage roles or permissions
- Access system-level operations

## Permission Hierarchy

```
Admin (All 61)
    ├── Editor (39) - Content Management
    │   └── Contributor (21) - Create + Read Only
    │       └── Reader (14) - Read Only
    └── Moderator (34) - User + Content Moderation
```

## Usage in Code

### Checking Permissions

```typescript
// Example middleware for checking permissions
const requirePermission = (resource: string, action: string) => {
  return async (req, res, next) => {
    const user = req.user;
    const requiredPermission = `${resource}:${action}`;

    // Check if user has permission through their roles
    const hasPermission = await checkUserPermission(user.id, requiredPermission);

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage in routes
router.post('/comics', requirePermission('comics', 'create'), createComic);
router.get('/comics', requirePermission('comics', 'list'), listComics);
router.put('/comics/:id', requirePermission('comics', 'update'), updateComic);
router.delete('/comics/:id', requirePermission('comics', 'delete'), deleteComic);
```

### Assigning Roles to Users

```typescript
// Assign role to user
await UserRoleXRef.create({
  userId: user.id,
  roleId: 2, // Editor role
});
```

### Custom Permission Checks

```typescript
// Check multiple permissions
const canManageComics = await hasAnyPermission(userId, [
  'comics:create',
  'comics:update',
  'comics:delete',
]);

// Check if user has specific role
const isAdmin = await hasRole(userId, 'Admin');
```

## Database Schema

### Permissions Table

```sql
CREATE TABLE Permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Roles Table

```sql
CREATE TABLE Roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### RolePermissionXRefs (Junction Table)

```sql
CREATE TABLE RolePermissionXRefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roleId INTEGER NOT NULL REFERENCES Roles(id),
  permissionId INTEGER NOT NULL REFERENCES Permissions(id),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### UserRoleXRefs (Junction Table)

```sql
CREATE TABLE UserRoleXRefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL REFERENCES Users(id),
  roleId INTEGER NOT NULL REFERENCES Roles(id),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

## Seeding Data

Permissions and roles are seeded using:

- `seeders/20251012000002-permissions.ts` - Creates all 61 permissions
- `seeders/20251012000003-roles-and-permissions.ts` - Creates 5 roles and assigns permissions

To seed:

```bash
npm run seed
```

## Adding New Permissions

When adding new resources or actions:

1. **Add to the permissions seeder** (`20251012000002-permissions.ts`)
2. **Update relevant roles** in `20251012000003-roles-and-permissions.ts`
3. **Run seeders** or create a new migration
4. **Update this documentation**

Example:

```typescript
// Add new permission
{
  name: 'comments:create',
  description: 'Create comments on comics',
  resource: 'comments',
  action: 'create',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## Security Best Practices

1. **Always check permissions** before performing sensitive operations
2. **Use least privilege** - assign minimum necessary permissions
3. **Audit permission changes** - log when permissions/roles are modified
4. **Regular reviews** - periodically review role assignments
5. **Test thoroughly** - ensure permission checks can't be bypassed

## Related Documentation

- [Security Overview](../security/README.md)
- [User Authentication](../security/authentication.md)
- [Database Schema](../database-schema.md)
- [API Controllers](../api/controllers.md)

---

**Total Permissions:** 61  
**Total Roles:** 5  
**Coverage:** All major resources with granular CRUD operations
