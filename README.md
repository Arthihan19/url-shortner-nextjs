# URL Shortner

## Table of contents

1. [Description](#description)
2. [Demo](#demo)
3. [Tech stack](#tech-stack)
4. [Features](#features)
5. [API](#API)
6. [Model](#Model)
7. [Usage](#usage)

## Description

This project is a personal endeavor to create a URL Shortener, a web application that allows users to shorten long URLs into more manageable, shorter versions. It's designed to be straightforward to use while providing key functionalities such as URL management and redirection confirmation.

The application is built using Next.js, leveraging server-side rendering and static site generation features for improved performance and SEO benefits. Authentication is handled through NextAuth.js, offering secure login and registration capabilities with support for email and GitHub as authentication providers.

For data management, the project utilizes Prisma as an Object-Relational Mapping (ORM) tool to interact with a PostgreSQL database. This setup facilitates efficient data storage, retrieval, and manipulation of URL records associated with user accounts.

The user interface is developed with Radix-ui components and styled using Tailwind CSS, aiming for a clean and responsive design that enhances user experience across various devices.



An instance of this is hosted here: TODO



## Demo

TODO


## Tech-stack

- [Typescript](https://www.typescriptlang.org/)
- [Nextjs](https://nextjs.org/)
- [NextAuthjs](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Postgresql](https://www.postgresql.org/)
- [Radix-ui](https://www.radix-ui.com/)
- [Tailwind](https://tailwindui.com/)

## Features

- User login/registration through email and github
- Users can create/delete short url links for long urls
- If someone visits the short url they would be redirected to the long url after confirming their intent to do so

## API

The ShortURL API provides functionality for creating, retrieving, and deleting shortened URLs. It leverages Next.js API routes and integrates with NextAuth for authentication, ensuring that operations such as creating and deleting shortened URLs are protected and only accessible by authenticated users.



#### Authentication

All endpoints require JWT-based authentication. Ensure to include a valid JWT token obtained through the authentication process in the `Authorization` header of your request.
Endpoints

#### POST `/api/shorturl`

Creates a new shortened URL.

* **Request Body:**
  
  * `longUrl` (required): The original URL to be shortened.
  * `customName` (optional): A custom alias for the shortened URL. Must be alphanumeric and between 4 to 12 characters.
  * `length` (optional): Desired length of the generated short URL ID. Acceptable values are 4, 8, or 12.

* **Responses:**
  
  * **201 Created:** Shortened URL created successfully. Returns the shortened URL details.
  * **400 Bad Request:** Validation failed for the input data.
  * **401 Unauthorized:** The user is not authenticated.

#### GET `/api/shorturl/{id}`

Retrieves the details of a specific shortened URL by its ID.

* **Path Parameters:**
  
  * `id`: The ID of the shortened URL.

* **Responses:**
  
  * **200 OK:** Returns the shortened URL details.
  * **404 Not Found:** No shortened URL found with the given ID.
  * **401 Unauthorized:** The user is not authenticated.

#### DELETE `/api/shorturl/{id}`

Deletes a specific shortened URL by its ID.

* **Path Parameters:**
  
  * `id`: The ID of the shortened URL to be deleted.

* **Responses:**
  
  * **200 OK:** Shortened URL deleted successfully.
  * **404 Not Found:** No shortened URL found with the given ID or the URL does not belong to the authenticated user.
  * **401 Unauthorized:** The user is not authenticated.
  * **403 Forbidden:** The authenticated user does not own the shortened URL.

#### GET `/api/shorturl`

Retrieves a paginated list of all shortened URLs created by the authenticated user.

* **Query Parameters:**
  
  * `page` (optional): The page number for pagination (default is 1).
  * `limit` (optional): The number of items per page (default is 10, max is 20).

* **Responses:**
  
  * **200 OK:** Returns a paginated list of shortened URLs along with pagination details.
  * **401 Unauthorized:** The user is not authenticated.

#### Pagination

Pagination information is included in responses for endpoints that return a list of items. It contains the following fields:

* `total`: Total number of items available.
* `totalPages`: Total number of pages based on the current `limit`.
* `currentPage`: The current page number.
* `limit`: The number of items per page.
  
  

## Model

```
model Account {
  id                       String  @id @default(cuid())
  userId                   String
  type                     String
  provider                 String
  providerAccountId        String
  refresh_token            String? @db.Text
  refresh_token_expires_in Int?
  access_token             String? @db.Text
  expires_at               Int?
  token_type               String?
  scope                    String?
  id_token                 String? @db.Text
  session_state            String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String     @id @default(cuid())
  name          String?
  email         String?    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  ShortURL      ShortURL[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model ShortURL {
  id        String   @id @db.VarChar(12)
  longUrl   String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  events    Event[]
}

model Event {
  id         Int       @id @default(autoincrement())
  shortURLId String
  eventType  EventType
  eventDate  DateTime  @default(now())
  shortURL   ShortURL  @relation(fields: [shortURLId], references: [id])

  @@index([eventType])
}

enum EventType {
  CLICK
  REJECT
  SUCCESS
}
```



## Usage

- `git clone TODO`

- populate the following env variables
  
  - ```
    # psql connection string
    DATABASE_URL=
    
    # From github oauth page https://github.com/settings/apps
    GITHUB_ID=
    GITHUB_SECRET_ID=
    
    # From resend https://resend.com/overview
    EMAIL_SERVER_USER=resend
    EMAIL_SERVER_PASSWORD=
    EMAIL_SERVER_HOST=smtp.resend.com
    EMAIL_SERVER_PORT=465
    EMAIL_FROM=onboarding@resend.dev
    ```

- `primsa generate`

- `npm run start`
