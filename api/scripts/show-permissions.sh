#!/bin/bash

# Permissions System Summary Script
# Displays comprehensive overview of the permissions system

DB_PATH="./database.sqlite"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         COMICS TRACKER - PERMISSIONS SYSTEM SUMMARY            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📊 STATISTICS"
echo "─────────────────────────────────────────────────────────────────"
TOTAL_PERMISSIONS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Permissions;")
TOTAL_ROLES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Roles;")
TOTAL_USERS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Users;")
TOTAL_ASSIGNMENTS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM RolePermissionXRefs;")

echo "Total Permissions:        $TOTAL_PERMISSIONS"
echo "Total Roles:              $TOTAL_ROLES"
echo "Total Users:              $TOTAL_USERS"
echo "Permission Assignments:   $TOTAL_ASSIGNMENTS"
echo ""

echo "📋 PERMISSIONS BY RESOURCE"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  resource as Resource,
  COUNT(*) as Count
FROM Permissions 
GROUP BY resource 
ORDER BY resource;
"
echo ""

echo "👥 ROLES AND PERMISSION COUNTS"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  r.name as Role,
  COUNT(rp.permissionId) as Permissions,
  r.description as Description
FROM Roles r 
LEFT JOIN RolePermissionXRefs rp ON r.id = rp.roleId 
GROUP BY r.id 
ORDER BY r.id;
"
echo ""

echo "🔑 ALL PERMISSIONS"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  id as ID,
  name as Permission,
  resource as Resource,
  action as Action
FROM Permissions 
ORDER BY resource, action;
"
echo ""

echo "✅ ADMIN ROLE PERMISSIONS (showing first 10)"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  p.name as Permission,
  p.resource as Resource,
  p.action as Action
FROM RolePermissionXRefs rp 
JOIN Permissions p ON rp.permissionId = p.id 
WHERE rp.roleId = 1 
ORDER BY p.resource, p.action 
LIMIT 10;
"
echo "... and 51 more"
echo ""

echo "✏️  EDITOR ROLE PERMISSIONS (showing first 10)"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  p.name as Permission,
  p.resource as Resource,
  p.action as Action
FROM RolePermissionXRefs rp 
JOIN Permissions p ON rp.permissionId = p.id 
WHERE rp.roleId = 2 
ORDER BY p.resource, p.action 
LIMIT 10;
"
echo "... and 29 more"
echo ""

echo "👁️  READER ROLE PERMISSIONS"
echo "─────────────────────────────────────────────────────────────────"
sqlite3 -column -header "$DB_PATH" "
SELECT 
  p.name as Permission,
  p.resource as Resource,
  p.action as Action
FROM RolePermissionXRefs rp 
JOIN Permissions p ON rp.permissionId = p.id 
WHERE rp.roleId = 4 
ORDER BY p.resource, p.action;
"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "For detailed documentation, see: docs/security/permissions.md"
echo "═══════════════════════════════════════════════════════════════════"
