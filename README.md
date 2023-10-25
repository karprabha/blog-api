# CodeGeekCentral - Your Ultimate Blogging Platform

![CodeGeekCentral Logo](./docs/images/codegeekcentral-logo.png)

## Project Overview

Welcome to CodeGeekCentral, your comprehensive blogging platform that brings together bloggers, readers, and content enthusiasts. CodeGeekCentral is a JAMstack-powered platform, empowers users to share their thoughts, explore exciting content, and engage with the community. Whether you're a seasoned writer or an avid reader, CodeGeekCentral is your go-to destination for all things blogs.

### Quick Links

-   [Main Site](https://codegeekcentral.vercel.app/)
-   [CMS (Content Management System)](https://codegeekcentral-cms.netlify.app/)
-   [API Documentation](https://documenter.getpostman.com/view/27019239/2s9YR3cFq2)

## Backend

CodeGeekCentral's backend is built with Node.js, Express.js, and MongoDB. It offers a set of powerful API endpoints to manage users, blogs, comments, authentication, and file uploads.

### API Endpoints

1. User Endpoint
2. Blogs Endpoint
3. Comments Endpoint
4. Auth Endpoint
5. Upload Endpoint

For detailed information about each endpoint, refer to our [Postman API Documentation](https://documenter.getpostman.com/view/27019239/2s9YR3cFq2).

### Technical Details

-   **Authentication**: Secure authentication with JWT. Refresh tokens are stored in HTTP-only cookies, and access tokens are included in API responses.
-   **Security Measures**: Robust query sanitization, data validation using Express Validator, and cascade delete for dependent Mongoose models.
-   **File Upload**: Utilizes Multer for server-side file processing, validation, and Cloudinary integration for storing and processing images.
-   **Role-Based Access Control (RBAC)**: Assigning roles to users for access control.
-   **Performance**: Implementing indexing for efficient data retrieval. Supports pagination for large datasets.
-   **Hosting**: The server is hosted on [CodeGeekCentral Server](https://codegeekcentral.onrender.com).

## Frontend: CodeGeekCentral-CMS

CodeGeekCentral's Content Management System (CMS) is built with Vite-React, TypeScript, React Router, and Tailwind CSS. It provides a user-friendly interface for bloggers to manage their content and profile.

### Key Features

-   **Routes**: Extensive routing for user authentication, profile management, blog creation, editing, and more.
-   **Validation**: Comprehensive form validation to ensure data integrity and security.
-   **State Management**: Access tokens stored securely in state for protection against XSS and CSRF.
-   **Custom Hooks**: Utilizes custom hooks for improved code organization.
-   **Profile Section**: Supports profile avatar upload with URL or file upload options.
-   **User Access Control**: Strict access control ensures only authors can edit their posts.

## Frontend: CodeGeekCentral (Main Site)

CodeGeekCentral's main site is built with Next.js, offering SEO-friendly routes and features like SSG, ISR, and SSR for optimal performance.

### SSR and SEO

-   **Routes**: Optimized for reading and commenting.
-   **SSG**: Key routes are statically generated for efficient delivery.
-   **Revalidation Time**: Frequent data change routes revalidate every 1 minute, while blogs revalidate every 1 hour.

## Upcoming Features

We have exciting plans for the future, including:

-   **Search and Discovery**: Implement advanced search and discovery functionalities to help users find relevant content.
-   **Featured Section**: Showcase top-rated and handpicked blog posts to provide users with a curated reading experience.

## Contributing

We welcome contributions from the community! If you'd like to get involved, please follow our [Contribution Guidelines](./CONTRIBUTING.md) to help us improve CodeGeekCentral.

## Credits

We'd like to express our gratitude to the following resources:

-   **Cloudinary**: We've utilized [Cloudinary](https://cloudinary.com/) to manage files like user avatar.

Your contributions have made this project truly special!
