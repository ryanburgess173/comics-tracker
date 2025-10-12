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

## Next Steps

Consider adding:

- Authentication/authorization middleware
- Pagination for GET all endpoints
- Filtering and sorting capabilities
- Relationship endpoints (e.g., get all comics for a specific universe)
- Input sanitization
- Rate limiting
- Caching
- Database transactions for complex operations
