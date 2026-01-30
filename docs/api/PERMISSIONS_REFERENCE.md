# API Permissions Reference

This document provides a comprehensive overview of all permission requirements for the Comics Tracker API endpoints.

## Overview

All protected endpoints require:

1. **Authentication**: Valid JWT token via `Authorization: Bearer <token>` header
2. **Permissions**: User must have the required permission(s) assigned through their role(s)

## Standard Response Codes

All protected endpoints include these standard responses:

- `401 Unauthorized` - Authentication required (missing or invalid token)
- `403 Forbidden` - Insufficient permissions (user lacks required permission)

---

## Authentication Endpoints (`/auth`)

### GET /auth/test

- **Permission**: `user:read`
- **Description**: Test endpoint to verify auth routes are working

### POST /auth/login

- **Permission**: None (public endpoint)
- **Description**: Authenticate and receive JWT token

### POST /auth/register

- **Permission**: None (public endpoint)
- **Description**: Register new user account

### POST /auth/reset-password

- **Permission**: None (public endpoint)
- **Description**: Request password reset email

### POST /auth/reset-password/:token

- **Permission**: None (public endpoint)
- **Description**: Confirm password reset with token

---

## Comics Endpoints (`/comics`)

### GET /comics

- **Permission**: `comics:list`
- **Description**: Retrieve list of all comics

### GET /comics/:id

- **Permission**: `comics:read`
- **Description**: Retrieve specific comic by ID

### POST /comics

- **Permission**: `comics:write`
- **Description**: Create a new comic

### PUT /comics/:id

- **Permission**: `comics:update`
- **Description**: Update an existing comic

### DELETE /comics/:id

- **Permission**: `comics:delete`
- **Description**: Delete a comic

---

## Publishers Endpoints (`/publishers`)

### GET /publishers

- **Permission**: `publishers:list`
- **Description**: Retrieve list of all publishers

### GET /publishers/:id

- **Permission**: `publishers:read`
- **Description**: Retrieve specific publisher by ID

### POST /publishers

- **Permission**: `publishers:create`
- **Description**: Create a new publisher

### PUT /publishers/:id

- **Permission**: `publishers:update`
- **Description**: Update an existing publisher

### DELETE /publishers/:id

- **Permission**: `publishers:delete`
- **Description**: Delete a publisher

---

## Creators Endpoints (`/creators`)

### GET /creators

- **Permission**: `creators:list`
- **Description**: Retrieve list of all creators

### GET /creators/:id

- **Permission**: `creators:read`
- **Description**: Retrieve specific creator by ID

### POST /creators

- **Permission**: `creators:create`
- **Description**: Create a new creator

### PUT /creators/:id

- **Permission**: `creators:update`
- **Description**: Update an existing creator

### DELETE /creators/:id

- **Permission**: `creators:delete`
- **Description**: Delete a creator

---

## Users Endpoints (`/users`)

### GET /users

- **Permission**: `users:list`
- **Description**: Retrieve list of all users

### GET /users/:id

- **Permission**: `user:read`
- **Description**: Retrieve specific user by ID

### POST /users

- **Permission**: `user:create`
- **Description**: Create a new user

### PUT /users/:id

- **Permission**: `user:update`
- **Description**: Update user information

### DELETE /users/:id

- **Permission**: `user:delete`
- **Description**: Delete a user

### POST /users/:id/change-password

- **Permission**: `user:update`
- **Description**: Change user's password

### GET /users/:id/roles

- **Permission**: `user:read`
- **Description**: Get user's assigned roles

### POST /users/:id/roles

- **Permission**: `roles:write`
- **Description**: Assign role to user

### DELETE /users/:id/roles/:roleId

- **Permission**: `roles:write`
- **Description**: Remove role from user

---

## Roles Endpoints (`/roles`)

### GET /roles

- **Permission**: `roles:list`
- **Description**: Retrieve list of all roles

### GET /roles/:id

- **Permission**: `roles:read`
- **Description**: Retrieve specific role by ID

### POST /roles

- **Permission**: `roles:create`
- **Description**: Create a new role

### PUT /roles/:id

- **Permission**: `roles:update`
- **Description**: Update an existing role

### DELETE /roles/:id

- **Permission**: `roles:delete`
- **Description**: Delete a role

### GET /roles/:id/permissions

- **Permission**: `roles:read`
- **Description**: Get permissions assigned to a role

### POST /roles/:id/permissions

- **Permission**: `roles:update`
- **Description**: Assign permission to role

### DELETE /roles/:id/permissions/:permissionId

- **Permission**: `roles:update`
- **Description**: Remove permission from role

### GET /roles/:id/users

- **Permission**: `roles:read`
- **Description**: Get users assigned to a role

---

## Permissions Endpoints (`/permissions`)

### GET /permissions

- **Permission**: `permissions:list`
- **Description**: Retrieve list of all permissions

### GET /permissions/by-resource

- **Permission**: `permissions:list`
- **Description**: Get permissions grouped by resource

### GET /permissions/:id

- **Permission**: `permissions:read`
- **Description**: Retrieve specific permission by ID

### POST /permissions

- **Permission**: `permissions:create`
- **Description**: Create a new permission

### PUT /permissions/:id

- **Permission**: `permissions:update`
- **Description**: Update an existing permission

### DELETE /permissions/:id

- **Permission**: `permissions:delete`
- **Description**: Delete a permission

---

## Omnibus Endpoints (`/omnibus`)

### GET /omnibus

- **Permission**: `omnibus:list`
- **Description**: Retrieve list of all omnibus editions

### GET /omnibus/:id

- **Permission**: `omnibus:read`
- **Description**: Retrieve specific omnibus by ID

### POST /omnibus

- **Permission**: `omnibus:create`
- **Description**: Create a new omnibus edition

### PUT /omnibus/:id

- **Permission**: `omnibus:update`
- **Description**: Update an existing omnibus

### DELETE /omnibus/:id

- **Permission**: `omnibus:delete`
- **Description**: Delete an omnibus

---

## Runs Endpoints (`/runs`)

### GET /runs

- **Permission**: `runs:list`
- **Description**: Retrieve list of all comic runs

### GET /runs/:id

- **Permission**: `runs:read`
- **Description**: Retrieve specific run by ID

### POST /runs

- **Permission**: `runs:create`
- **Description**: Create a new run

### PUT /runs/:id

- **Permission**: `runs:update`
- **Description**: Update an existing run

### DELETE /runs/:id

- **Permission**: `runs:delete`
- **Description**: Delete a run

---

## Trade Paperbacks Endpoints (`/trade-paperbacks`)

### GET /trade-paperbacks

- **Permission**: `tradePaperbacks:list`
- **Description**: Retrieve list of all trade paperbacks

### GET /trade-paperbacks/:id

- **Permission**: `tradePaperbacks:read`
- **Description**: Retrieve specific trade paperback by ID

### POST /trade-paperbacks

- **Permission**: `tradePaperbacks:create`
- **Description**: Create a new trade paperback

### PUT /trade-paperbacks/:id

- **Permission**: `tradePaperbacks:update`
- **Description**: Update an existing trade paperback

### DELETE /trade-paperbacks/:id

- **Permission**: `tradePaperbacks:delete`
- **Description**: Delete a trade paperback

---

## Universes Endpoints (`/universes`)

### GET /universes

- **Permission**: `universes:list`
- **Description**: Retrieve list of all universes

### GET /universes/:id

- **Permission**: `universes:read`
- **Description**: Retrieve specific universe by ID

### POST /universes

- **Permission**: `universes:create`
- **Description**: Create a new universe

### PUT /universes/:id

- **Permission**: `universes:update`
- **Description**: Update an existing universe

### DELETE /universes/:id

- **Permission**: `universes:delete`
- **Description**: Delete a universe

---

## Permission Naming Convention

Permissions follow the pattern: `{resource}:{action}`

### Resources

- `user` - User management
- `roles` - Role management
- `permissions` - Permission management
- `comics` - Comic management
- `publishers` - Publisher management
- `creators` - Creator management
- `omnibus` - Omnibus management
- `runs` - Run management
- `tradePaperbacks` - Trade paperback management
- `universes` - Universe management

### Actions

- `list` - View list of resources
- `read` - View single resource details
- `create` - Create new resource
- `write` - Create/write resource (alternative to create)
- `update` - Modify existing resource
- `delete` - Remove resource

---

## Testing Permissions

To test permissions in your environment:

1. **Check your permissions**:

   ```bash
   GET /permissions
   ```

2. **Verify role permissions**:

   ```bash
   GET /roles/:roleId/permissions
   ```

3. **Check user roles**:
   ```bash
   GET /users/:userId/roles
   ```

---

## Common Permission Sets

### Admin Role

Typically has all permissions including:

- All `user:*` permissions
- All `roles:*` permissions
- All `permissions:*` permissions
- All resource management permissions

### Editor Role

Typical permissions:

- `comics:list`, `comics:read`, `comics:write`, `comics:update`
- `creators:list`, `creators:read`, `creators:create`, `creators:update`
- `publishers:list`, `publishers:read`
- `runs:list`, `runs:read`, `runs:create`, `runs:update`
- `omnibus:list`, `omnibus:read`, `omnibus:create`, `omnibus:update`
- `tradePaperbacks:list`, `tradePaperbacks:read`, `tradePaperbacks:create`, `tradePaperbacks:update`
- `universes:list`, `universes:read`

### Viewer Role

Typical permissions:

- `comics:list`, `comics:read`
- `creators:list`, `creators:read`
- `publishers:list`, `publishers:read`
- `runs:list`, `runs:read`
- `omnibus:list`, `omnibus:read`
- `tradePaperbacks:list`, `tradePaperbacks:read`
- `universes:list`, `universes:read`

---

## Last Updated

October 16, 2025
