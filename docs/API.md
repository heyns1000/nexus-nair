# Nexus Nair API Documentation

This document provides human-friendly documentation for the Nexus Nair API. For the complete machine-readable specification, see [openapi.yaml](./openapi.yaml).

## Base URL

```
https://api.example.com
```

## Authentication

The API supports two authentication methods:

### 1. Bearer Token (JWT)

Most endpoints require authentication via JWT token. First, obtain a token by calling the `/auth/login` endpoint with valid credentials. Then include the token in subsequent requests:

```
Authorization: Bearer <your-jwt-token>
```

### 2. API Key

For service-to-service authentication, use an API key in the header:

```
X-API-Key: <your-api-key>
```

## Canonical Error Schema

All error responses follow a consistent structure to make error handling predictable:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "additionalInfo"
    },
    "timestamp": "2023-11-14T20:22:21.054Z",
    "requestId": "req_abc123xyz"
  }
}
```

### Error Fields

- **code** (required): Machine-readable error code (e.g., `INVALID_CREDENTIALS`, `NOT_FOUND`)
- **message** (required): Human-readable error description
- **details** (optional): Additional context about the error
- **timestamp** (optional): ISO 8601 timestamp when the error occurred
- **requestId** (optional): Unique identifier for request tracking and support

## Common Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH request |
| 201 | Created | Successful POST request that creates a resource |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Malformed request syntax |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but lacking permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error with valid syntax |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary server issue |

## Endpoint Template

When documenting new endpoints, use this template:

### [Endpoint Title]

**Path:** `[METHOD] /path/to/endpoint`

**Purpose:** Brief description of what this endpoint does

**Authentication:** Required/Optional (specify type: Bearer Token, API Key, or None)

**Permissions:** List required roles or permissions

**Rate Limit:** Specify rate limits if applicable (e.g., 100 requests/minute)

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Path Parameters:**
- `param`: Description (type, required/optional)

**Query Parameters:**
- `param`: Description (type, required/optional, default value)

**Request Body:**
```json
{
  "field": "value"
}
```

#### Example Request

**cURL:**
```bash
curl -X METHOD https://api.example.com/path \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field":"value"}'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('https://api.example.com/path', {
  method: 'METHOD',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ field: 'value' })
});
const data = await response.json();
```

#### Responses

**200 OK**
```json
{
  "result": "data"
}
```

**401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### Notes

- Additional information, caveats, or tips

---

## Example Endpoints

### Authentication

#### Login

**Path:** `POST /auth/login`

**Purpose:** Authenticate a user and receive a JWT token

**Authentication:** None (public endpoint)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "usr_123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2023-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `422`: Validation error (invalid email format, missing fields)

---

### Users

#### Get User by ID

**Path:** `GET /users/{id}`

**Purpose:** Retrieve detailed information about a specific user

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `id`: User identifier (string, required)

**Response (200 OK):**
```json
{
  "id": "usr_123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2023-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401`: Unauthorized (missing or invalid token)
- `404`: User not found

---

### Items

#### List Items

**Path:** `GET /items`

**Purpose:** Retrieve a paginated list of items

**Authentication:** Required (Bearer Token)

**Query Parameters:**
- `page`: Page number (integer, optional, default: 1)
- `perPage`: Items per page (integer, optional, default: 20, max: 100)
- `status`: Filter by status (string, optional, values: active, inactive, archived)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "item_456def",
      "name": "Sample Item 1",
      "description": "First sample item",
      "status": "active",
      "createdAt": "2023-02-20T14:15:00Z",
      "updatedAt": "2023-02-20T14:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 150
  }
}
```

---

#### Create Item

**Path:** `POST /items`

**Purpose:** Create a new item

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "name": "New Item",
  "description": "This is a new item",
  "status": "active"
}
```

**Response (201 Created):**
```json
{
  "id": "item_new123",
  "name": "New Item",
  "description": "This is a new item",
  "status": "active",
  "createdAt": "2023-11-14T20:22:21.054Z",
  "updatedAt": "2023-11-14T20:22:21.054Z"
}
```

**Error Responses:**
- `401`: Unauthorized
- `422`: Validation error (missing name, invalid status)

---

#### Delete Item

**Path:** `DELETE /items/{id}`

**Purpose:** Delete an item by ID

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `id`: Item identifier (string, required)

**Response (204 No Content):** Empty body

**Error Responses:**
- `401`: Unauthorized
- `404`: Item not found

---

## How to Evolve This Documentation

### Adding New Endpoints

1. **Update OpenAPI Spec**: Add the new endpoint to `docs/openapi.yaml` following the existing patterns
2. **Update API.md**: Add human-friendly documentation for the endpoint using the template above
3. **Add Examples**: Include request examples in `docs/examples/requests.md`
4. **Validate**: Run `npx @stoplight/spectral-cli lint docs/openapi.yaml --config docs/.spectral.yaml`

### Generating Documentation from Code

For future iterations, consider these tools to auto-generate documentation from your code:

#### For Node.js/Express APIs
- **swagger-jsdoc**: Generate OpenAPI from JSDoc comments in your route handlers
  ```bash
  npm install --save-dev swagger-jsdoc
  ```

#### For PHP APIs
- **Scribe**: Generate API documentation for Laravel/PHP applications
  ```bash
  composer require --dev knuckleswtf/scribe
  ```

#### For Other Frameworks
- **FastAPI** (Python): Built-in automatic OpenAPI generation
- **ASP.NET Core** (C#): Swashbuckle for Swagger/OpenAPI
- **Spring Boot** (Java): SpringDoc OpenAPI

### Keeping Documentation in Sync

- Run the `validate-openapi` GitHub Action on every PR to catch issues early
- Generate the HTML documentation locally before committing: `npx redoc-cli bundle docs/openapi.yaml -o docs/openapi.html`
- Consider setting up a documentation site using tools like:
  - [Redoc](https://redocly.com/redoc) - Static HTML from OpenAPI
  - [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive API explorer
  - [Stoplight Elements](https://stoplight.io/open-source/elements) - Beautiful API docs

### Best Practices

1. **Version your API**: Use semantic versioning (e.g., v1, v2) in your paths
2. **Document errors thoroughly**: Every possible error response should be documented
3. **Include examples**: Real examples help developers integrate faster
4. **Keep it current**: Update docs in the same PR as code changes
5. **Test examples**: Ensure all example requests actually work
