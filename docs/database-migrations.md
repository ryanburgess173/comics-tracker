# Database Migrations Guide

This project uses **Sequelize CLI** for database migrations with TypeScript.

## 📋 Overview

Database migrations provide:

- ✅ **Version control** for database schema changes
- ✅ **Rollback capability** for schema changes
- ✅ **Team collaboration** with consistent database states
- ✅ **Safe schema modifications** without data loss
- ✅ **Documentation** of all database changes over time

## 🚀 Quick Start

### Running Migrations

```bash
cd api

# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback the last migration
npm run migrate:undo

# Rollback all migrations (⚠️ Use with caution!)
npm run migrate:undo:all
```

## 📝 Creating a New Migration

### 1. Generate a Migration File

```bash
cd api
npm run migration:generate -- add-column-to-users
```

This creates a new TypeScript migration file in `api/migrations/` with a timestamp prefix.

### 2. Edit the Migration File

Open the generated file and define your `up` and `down` methods:

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Add a new column
    await queryInterface.addColumn('Users', 'phoneNumber', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Remove the column (rollback)
    await queryInterface.removeColumn('Users', 'phoneNumber');
  },
};
```

### 3. Run the Migration

```bash
npm run migrate
```

## 🔧 Common Migration Operations

### Adding a Column

```typescript
await queryInterface.addColumn('TableName', 'columnName', {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'default-value',
});
```

### Removing a Column

```typescript
await queryInterface.removeColumn('TableName', 'columnName');
```

### Changing a Column

```typescript
await queryInterface.changeColumn('TableName', 'columnName', {
  type: DataTypes.TEXT,
  allowNull: true,
});
```

### Adding an Index

```typescript
await queryInterface.addIndex('TableName', ['columnName'], {
  name: 'index_name',
  unique: true,
});
```

### Removing an Index

```typescript
await queryInterface.removeIndex('TableName', 'index_name');
```

### Creating a Table

```typescript
await queryInterface.createTable('NewTable', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
```

### Adding a Foreign Key

```typescript
await queryInterface.addColumn('ChildTable', 'parentId', {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'ParentTable',
    key: 'id',
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});
```

## 📂 Project Structure

```
api/
├── .sequelizerc              # Sequelize CLI configuration
├── config/
│   └── config.ts             # Database connection config
├── migrations/               # Migration files (run in order)
│   ├── 20251011000001-create-users.ts
│   ├── 20251011000002-create-publishers.ts
│   └── ...
├── models/                   # Sequelize models
└── seeders/                  # Seed data (optional)
```

## ⚠️ Important Notes

### Migration Order

- Migrations run in **timestamp order** (filename prefix)
- Always ensure migrations respect foreign key dependencies
- Tables must be created before references to them

### Best Practices

1. **Always include both `up` and `down` methods**
   - `up`: Apply the change
   - `down`: Rollback the change

2. **Test migrations locally first**

   ```bash
   npm run migrate          # Apply
   npm run migrate:undo     # Rollback
   npm run migrate          # Re-apply
   ```

3. **Never modify existing migration files**
   - Once a migration is committed and run in production, create a new migration to make changes

4. **Use descriptive migration names**

   ```bash
   # Good
   npm run migration:generate -- add-email-index-to-users

   # Bad
   npm run migration:generate -- update
   ```

5. **Keep migrations small and focused**
   - One migration = one logical change
   - Easier to review and rollback

## 🔄 Migration Workflow

### Development

1. Create a migration for your schema change
2. Run the migration locally
3. Test that the change works
4. Commit the migration file to version control

### Production

1. Pull the latest code (including new migrations)
2. Run `npm run migrate` to apply pending migrations
3. Verify the application works correctly

## 🧪 Testing with Migrations

For tests, we still use `sequelize.sync({ force: true })` to create a clean in-memory database. This is configured in `jest.setup.ts`.

Production and development environments use migrations exclusively.

## 🌱 Database Seeders

Seeders populate your database with initial or test data. This project includes seeders for:

- **Admin user** - Default admin account
- **Publishers** - Major comic publishers (Marvel, DC, Image, etc.)
- **Universes** - Comic universes (Marvel Universe, DC Universe, etc.)
- **Creators** - Famous comic creators (Stan Lee, Jack Kirby, Neil Gaiman, etc.)
- **Sample Comics** - Popular comic runs and issues

### Running Seeders

```bash
cd api

# Run all seeders
npm run seed

# Undo the last seeder
npm run seed:undo

# Undo all seeders (⚠️ Use with caution!)
npm run seed:undo:all
```

### Quick Setup (Migrations + Seeds)

To set up a fresh database with sample data:

```bash
cd api
npm run migrate    # Create database schema
npm run seed       # Populate with sample data
```

### Creating a New Seeder

```bash
npm run seed:generate -- add-more-comics
```

This creates a new TypeScript seeder file in `api/seeders/`. Edit it with your seed data:

```typescript
import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert(
      'TableName',
      [
        {
          field1: 'value1',
          field2: 'value2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete(
      'TableName',
      {
        field1: 'value1',
      },
      {}
    );
  },
};
```

### Seeder Best Practices

1. **Always include `down` method** - For undoing seed data
2. **Use explicit IDs when needed** - For maintaining relationships
3. **Order matters** - Seed parent tables before children
4. **Handle existing data** - Use `bulkDelete` carefully in `down` method
5. **Don't seed sensitive data in production** - Admin credentials should be managed separately

### Default Admin Credentials

The admin user seeder creates:

- **Email**: `admin@comics-tracker.com`
- **Password**: `Admin123!`

⚠️ **Important**: Change the admin password immediately after first login in production!

## 🆘 Troubleshooting

### Check Migration Status

```bash
npm run migrate:status
```

### Migration is Stuck

If a migration fails halfway:

1. Fix the migration file
2. Manually rollback or fix the database
3. Re-run the migration

### Reset Database (Development Only!)

```bash
# ⚠️ This will delete all data!
rm api/database.sqlite
npm run migrate
```

## 📚 Additional Resources

- [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize CLI Documentation](https://github.com/sequelize/cli)
- [QueryInterface API](https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface)

## 🎯 Next Steps

- Review the existing migration files in `api/migrations/`
- Run `npm run migrate` to create your database schema
- Create new migrations for any schema changes
- Always test migrations before deploying to production
