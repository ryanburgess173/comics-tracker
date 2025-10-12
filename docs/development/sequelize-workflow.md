# Sequelize CLI Workflow Guide

This guide explains the proper workflow for creating and maintaining database models and migrations in this project.

## Table of Contents

- [Overview](#overview)
- [When to Use model:generate](#when-to-use-modelgenerate)
- [When to Create Manually](#when-to-create-manually)
- [Creating New Models](#creating-new-models)
- [Modifying Existing Models](#modifying-existing-models)
- [Migration Best Practices](#migration-best-practices)
- [Common Commands](#common-commands)

## Overview

This project uses a **hybrid approach** to Sequelize models and migrations:

- **Existing models**: Manually created TypeScript models with corresponding migrations
- **New models**: Should use `sequelize-cli model:generate` to create both model and migration together
- **Model changes**: Require separate migration files

## When to Use model:generate

Use the Sequelize CLI `model:generate` command for:

✅ Creating **new models** from scratch  
✅ When you want automatic migration generation  
✅ Simple models with basic attributes

### Example: Creating a New Model

```bash
cd api
npm run model:generate -- Genre --attributes name:string,description:text,publisherId:integer
```

This will create:

- `models/genre.js` - A JavaScript model file
- `migrations/XXXXXX-create-genre.js` - A migration file

**Important**: The generated files will be in **JavaScript**. You'll need to:

1. Convert the model to TypeScript
2. Move it to the proper location
3. Update the migration if needed
4. Create the corresponding TypeScript type interface

## When to Create Manually

Create models and migrations manually for:

✅ Complex models with custom validation  
✅ Models with many associations  
✅ When you need full TypeScript features from the start  
✅ When you need precise control over the migration

### Example: Manual Creation Workflow

1. **Create the TypeScript type** (`types/GenreAttributes.ts`):

```typescript
export interface GenreAttributes {
  id: number;
  name: string;
  description?: string;
  publisherId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GenreInstance = Model<GenreAttributes> & GenreAttributes;
```

2. **Create the model** (`models/Genre.ts`):

```typescript
import { DataTypes } from 'sequelize';
import sequelize from '../db';
import { GenreInstance } from '../types/GenreAttributes';

const Genre = sequelize.define<GenreInstance>(
  'Genre',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publisherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Publishers',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Genre;
```

3. **Create the migration** (`migrations/YYYYMMDDHHMMSS-create-genre.js`):

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Genres', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      publisherId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Publishers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Genres');
  },
};
```

## Modifying Existing Models

**Never modify the initial migration!** Instead, create a new migration for changes.

### Example: Adding a Column

1. **Update the model** (`models/Comic.ts`):

```typescript
// Add new field to model definition
rating: {
  type: DataTypes.INTEGER,
  allowNull: true,
  validate: {
    min: 1,
    max: 5,
  },
},
```

2. **Create a new migration**:

```bash
npm run migration:generate -- add-rating-to-comics
```

3. **Edit the migration file**:

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comics', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comics', 'rating');
  },
};
```

4. **Run the migration**:

```bash
npm run migrate
```

## Migration Best Practices

### 1. Always Include Both `up` and `down`

Every migration should be reversible:

```javascript
async up(queryInterface, Sequelize) {
  // Apply changes
},

async down(queryInterface, Sequelize) {
  // Revert changes
}
```

### 2. Maintain Foreign Key Integrity

Always specify `onUpdate` and `onDelete` behavior:

```javascript
references: {
  model: 'Publishers',
  key: 'id',
},
onUpdate: 'CASCADE',
onDelete: 'SET NULL', // or 'CASCADE' for junction tables
```

### 3. Create Tables in Dependency Order

Create tables with no dependencies first:

1. Publishers, Creators (no dependencies)
2. Universes, Runs (depend on above)
3. Comics (depends on all above)
4. Junction tables (depend on multiple tables)

### 4. Add Indexes for Performance

```javascript
await queryInterface.addIndex('Comics', ['publisherId']);
await queryInterface.addIndex('Comics', ['runId']);
```

### 5. Use Transactions for Complex Migrations

```javascript
async up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.createTable('NewTable', { /* ... */ }, { transaction });
    await queryInterface.addColumn('OldTable', 'newField', { /* ... */ }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

## Common Commands

### Migration Commands

```bash
# Check migration status
npm run migrate:status

# Run all pending migrations
npm run migrate

# Undo the last migration
npm run migrate:undo

# Undo all migrations (careful!)
npm run migrate:undo:all

# Generate a new migration file
npm run migration:generate -- migration-name
```

### Model Commands

```bash
# Generate a new model with migration
npm run model:generate -- ModelName --attributes field1:type,field2:type

# Example
npm run model:generate -- Author --attributes name:string,bio:text,birthDate:date
```

### Seeder Commands

```bash
# Run all seeders
npm run seed

# Generate a new seeder
npm run seed:generate -- seeder-name

# Undo the last seeder
npm run seed:undo

# Undo all seeders
npm run seed:undo:all
```

## Common Scenarios

### Scenario 1: Adding a New Simple Model

Use `model:generate`:

```bash
npm run model:generate -- Tag --attributes name:string,color:string
```

Then convert to TypeScript and add associations.

### Scenario 2: Adding a New Complex Model

Create manually following the [Manual Creation Workflow](#when-to-create-manually).

### Scenario 3: Adding a Column to Existing Model

1. Generate migration: `npm run migration:generate -- add-field-to-table`
2. Edit migration file with `addColumn` and `removeColumn`
3. Update the model TypeScript file
4. Update the type interface
5. Run migration: `npm run migrate`

### Scenario 4: Renaming a Column

```javascript
async up(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Comics', 'oldName', 'newName');
}

async down(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Comics', 'newName', 'oldName');
}
```

### Scenario 5: Creating a Junction Table

Always use cascade delete for junction tables:

```javascript
await queryInterface.createTable('ModelAModelBs', {
  modelAId: {
    type: Sequelize.INTEGER,
    references: { model: 'ModelAs', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // CASCADE for junction tables
  },
  modelBId: {
    type: Sequelize.INTEGER,
    references: { model: 'ModelBs', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
});
```

## Testing Migrations

Always test your migrations in both directions:

```bash
# Apply migration
npm run migrate

# Verify database state
# Check tables, columns, constraints

# Rollback migration
npm run migrate:undo

# Verify original state restored

# Re-apply migration
npm run migrate
```

## Troubleshooting

### Migration Already Executed

If you need to re-run a migration:

```bash
# Undo the migration
npm run migrate:undo

# Make your changes to the migration file

# Re-run the migration
npm run migrate
```

### Database Out of Sync with Models

If your database doesn't match your models:

1. Check migration status: `npm run migrate:status`
2. Run pending migrations: `npm run migrate`
3. If needed, create a new migration for the differences

### Foreign Key Constraint Errors

Ensure you're creating/dropping tables in the correct order:

- Create: Parent tables first, then child tables
- Drop: Child tables first, then parent tables

## Additional Resources

- [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize CLI Documentation](https://github.com/sequelize/cli)
- [Database Schema Documentation](../database-schema.md)
- [Database Migrations Documentation](../database-migrations.md)

## Questions?

If you're unsure about the best approach for your use case, ask the team or refer to existing examples in the `models/` and `migrations/` directories.
