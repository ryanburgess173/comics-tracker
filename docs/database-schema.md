# Comics Tracker Database Schema

## Overview

The Comics Tracker database is designed to manage a comprehensive comic book collection, including individual issues, collected editions (trade paperbacks and omnibuses), and their relationships within universes and runs.

> **Note:** Database schema is managed through Sequelize migrations. See [Database Migrations Guide](./database-migrations.md) for information on running and creating migrations.

## Entity Relationship Diagram

```
┌─────────────────┐
│    Universe     │
│─────────────────│
│ id (PK)         │
│ name*           │
│ description     │
│ publisher       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│      Run        │
│─────────────────│
│ id (PK)         │
│ seriesName*     │
│ keyAuthorId (FK)│
│ keyArtistId (FK)│
│ startDate       │
│ endDate         │
│ startIssue      │
│ endIssue        │
│ description     │
│ universeId (FK) │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│     Comic       │
│─────────────────│
│ id (PK)         │
│ title*          │
│ author*         │
│ description     │
│ imageUrl        │
│ pages           │
│ publisher       │
│ publishedDate   │
│ runId (FK)      │
│ variant         │
└────────┬────────┘
         │
         │ N:M                    N:M
    ┌────┴────┐              ┌────┴────┐
    │         │              │         │
┌───▼──────────────────┐ ┌──▼──────────────────┐
│ TradePaperbackComic  │ │   OmnibusComic      │
│        XRef          │ │       XRef          │
│──────────────────────│ │─────────────────────│
│ id (PK)              │ │ id (PK)             │
│ tradePaperbackId(FK) │ │ omnibusId (FK)      │
│ comicId (FK)         │ │ comicId (FK)        │
│ orderInCollection    │ │ orderInCollection   │
└───┬──────────────────┘ └──┬──────────────────┘
    │                       │
    │ N:M                   │ N:M
    │                       │
┌───▼──────────────┐   ┌───▼──────────────┐
│ TradePaperback   │   │    Omnibus       │
│──────────────────│   │──────────────────│
│ id (PK)          │   │ id (PK)          │
│ title*           │   │ title*           │
│ coverImageUrl    │   │ coverImageUrl    │
│ publicationDate  │   │ publicationDate  │
│ isbn             │   │ isbn             │
│ description      │   │ description      │
│ pageCount        │   │ pageCount        │
│ publisher        │   │ publisher        │
│ volume           │   │ volume           │
└──────────────────┘   └──────────────────┘

* = Required field
PK = Primary Key
FK = Foreign Key
```

## Entity Descriptions

### Universe

Represents a comic book universe (e.g., Marvel 616, Star Wars, DC Universe).

**Fields:**

- `id`: Auto-increment primary key
- `name`: Unique universe name (required)
- `description`: Optional description
- `publisherId`: Foreign key to Publisher

**Relationships:**

- Belongs to one Publisher (N:1)
- Has many Runs (1:N)

**Example:**

```typescript
{
  name: "Star Wars",
  publisherId: 1, // Marvel Comics
  description: "Star Wars comics universe"
}
```

### Run

Represents a specific run/series of a comic (e.g., "Star Wars (2015)", "Amazing Spider-Man (2018)").

**Fields:**

- `id`: Auto-increment primary key
- `seriesName`: Name of the series (required)
- `keyAuthorId`: Reference to primary author (future implementation)
- `keyArtistId`: Reference to primary artist (future implementation)
- `startDate`: When the run began
- `endDate`: When the run ended (null if ongoing)
- `startIssue`: Starting issue number
- `endIssue`: Ending issue number (null if ongoing)
- `description`: Description of the run
- `universeId`: Foreign key to Universe

**Relationships:**

- Belongs to one Universe (N:1)
- Has many Comics (1:N)

**Example:**

```typescript
{
  seriesName: "Star Wars (2015)",
  startIssue: 1,
  endIssue: 75,
  startDate: new Date('2015-01-01'),
  endDate: new Date('2019-12-31'),
  universeId: 1
}
```

### Comic

Represents an individual comic book issue, including variant covers.

**Fields:**

- `id`: Auto-increment primary key
- `title`: Comic title (required) - e.g., "Amazing Spider-Man #1"
- `author`: Author name (required)
- `description`: Synopsis or description
- `imageUrl`: URL to cover image
- `pages`: Number of pages
- `publisher`: Publisher name
- `publishedDate`: Publication date
- `runId`: Foreign key to Run
- `variant`: Variant number (defaults to 1)
  - 1 = Regular cover / Cover A
  - 2+ = Variant covers

**Relationships:**

- Belongs to one Run (N:1)
- Belongs to many TradePaperbacks (N:M via TradePaperbackComicXRef)
- Belongs to many Omnibuses (N:M via OmnibusComicXRef)

**Example:**

```typescript
// Regular cover
{
  title: "Amazing Spider-Man #1",
  author: "Dan Slott",
  imageUrl: "https://example.com/asm1-cover-a.jpg",
  pages: 32,
  variant: 1,
  runId: 5
}

// Variant cover
{
  title: "Amazing Spider-Man #1",
  author: "Dan Slott",
  imageUrl: "https://example.com/asm1-cover-b.jpg",
  pages: 32,
  variant: 2,
  runId: 5
}
```

### TradePaperback (TPB)

Represents a trade paperback collection, typically containing 4-6 comic issues.

**Fields:**

- `id`: Auto-increment primary key
- `title`: TPB title (required) - e.g., "Star Wars Vol. 1: Skywalker Strikes"
- `coverImageUrl`: URL to TPB cover image
- `publicationDate`: When the TPB was published
- `isbn`: Unique ISBN identifier
- `description`: Description (e.g., "Collects Star Wars #1-6")
- `pageCount`: Total pages
- `publisher`: Publisher name
- `volume`: Volume number (for series of TPBs)

**Relationships:**

- Contains many Comics (N:M via TradePaperbackComicXRef)

**Example:**

```typescript
{
  title: "Star Wars Vol. 1: Skywalker Strikes",
  volume: 1,
  isbn: "978-0785192138",
  description: "Collects Star Wars (2015) #1-6",
  pageCount: 160,
  publisher: "Marvel Comics",
  publicationDate: new Date('2015-07-07')
}
```

### Omnibus

Represents a large omnibus collection, typically containing up to 50 comic issues.

**Fields:**

- `id`: Auto-increment primary key
- `title`: Omnibus title (required)
- `coverImageUrl`: URL to omnibus cover image
- `publicationDate`: When published
- `isbn`: Unique ISBN identifier
- `description`: Description (e.g., "Collects The Walking Dead #1-48")
- `pageCount`: Total pages (typically 800-1500+)
- `publisher`: Publisher name
- `volume`: Volume number (for multi-volume omnibuses)

**Relationships:**

- Contains many Comics (N:M via OmnibusComicXRef)

**Example:**

```typescript
{
  title: "The Walking Dead Omnibus Vol. 1",
  volume: 1,
  isbn: "978-1534313941",
  description: "Collects The Walking Dead #1-48",
  pageCount: 1088,
  publisher: "Image Comics",
  publicationDate: new Date('2020-10-13')
}
```

### TradePaperbackComicXRef

Junction table linking TradePaperbacks to Comics (many-to-many).

**Fields:**

- `id`: Auto-increment primary key
- `tradePaperbackId`: Foreign key to TradePaperback
- `comicId`: Foreign key to Comic
- `orderInCollection`: Order of comic within the TPB (1, 2, 3, etc.)

**Purpose:**

- A comic can appear in multiple trade paperbacks (e.g., in Vol. 1 and a Complete Collection)
- A trade paperback contains multiple comics
- Maintains reading order via `orderInCollection`

### OmnibusComicXRef

Junction table linking Omnibuses to Comics (many-to-many).

**Fields:**

- `id`: Auto-increment primary key
- `omnibusId`: Foreign key to Omnibus
- `comicId`: Foreign key to Comic
- `orderInCollection`: Order of comic within the omnibus

**Purpose:**

- A comic can appear in multiple omnibuses
- An omnibus contains many comics
- Maintains reading order via `orderInCollection`

## Common Queries

### Get all comics in a run with variants

```typescript
const comics = await Comic.findAll({
  where: {
    title: 'Amazing Spider-Man #1',
    runId: 5,
  },
  order: [['variant', 'ASC']],
});
```

### Get all runs in a universe

```typescript
const universe = await Universe.findByPk(1, {
  include: ['runs'],
});
```

### Get all comics in a trade paperback (in order)

```typescript
const tpb = await TradePaperback.findByPk(1, {
  include: [
    {
      model: Comic,
      as: 'comics',
      through: { attributes: ['orderInCollection'] },
    },
  ],
  order: [[{ model: Comic, as: 'comics' }, 'TradePaperbackComicXRef', 'orderInCollection', 'ASC']],
});
```

### Get complete hierarchy: Universe → Run → Comics

```typescript
const universe = await Universe.findByPk(1, {
  include: [
    {
      model: Run,
      as: 'runs',
      include: [
        {
          model: Comic,
          as: 'comics',
        },
      ],
    },
  ],
});
```

## Design Decisions

### Why Many-to-Many for Collections?

Comics can appear in multiple collections:

- Issue #1 might be in "Vol. 1 TPB" AND "Complete Omnibus"
- A special issue might appear in multiple "Best Of" collections

### Why Variant as a Field?

Instead of a separate `ComicVariant` model, we use a simple `variant` field because:

- Each variant is essentially the same comic with different cover art
- Simpler queries and data structure
- Variants share all metadata except `imageUrl` and `variant` number

### Volume Numbers on Collections

TPBs and Omnibuses have `volume` fields to track series:

- "Star Wars Vol. 1", "Star Wars Vol. 2", etc.
- "Walking Dead Omnibus Vol. 1", "Walking Dead Omnibus Vol. 2", etc.
- Each volume has independent publication dates and covers

## Future Enhancements

Potential additions to consider:

- `Creator` model (referenced in Run but not yet implemented) - tracks comic creators with a `creatorType` field (ARTIST or AUTHOR)
- User collections and wishlists
- Comic conditions and grading
- Purchase history and pricing
- Reading lists
- Review and rating system
