# API Request Examples

This document provides practical code examples for interacting with the Nexus Nair API using various tools and languages.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Items](#items)

---

## Authentication

### Login (POST /auth/login)

Get a JWT token by providing valid credentials.

#### cURL

```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

#### JavaScript (fetch)

```javascript
const login = async (email, password) => {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  const data = await response.json();
  // Store the token for subsequent requests
  localStorage.setItem('authToken', data.token);
  return data;
};

// Usage
try {
  const result = await login('user@example.com', 'SecurePassword123');
  console.log('Logged in as:', result.user.name);
  console.log('Token expires in:', result.expiresIn, 'seconds');
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### JavaScript (axios)

```javascript
import axios from 'axios';

const login = async (email, password) => {
  try {
    const response = await axios.post('https://api.example.com/auth/login', {
      email,
      password
    });
    
    // Store the token
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
};
```

---

## Users

### Get User by ID (GET /users/{id})

Retrieve information about a specific user.

#### cURL

```bash
# Replace <TOKEN> with your actual JWT token
curl -X GET https://api.example.com/users/usr_123abc \
  -H "Authorization: Bearer <TOKEN>"
```

#### JavaScript (fetch)

```javascript
const getUser = async (userId) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`https://api.example.com/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - please login again');
    }
    if (response.status === 404) {
      throw new Error('User not found');
    }
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return await response.json();
};

// Usage
try {
  const user = await getUser('usr_123abc');
  console.log('User:', user.name);
  console.log('Email:', user.email);
  console.log('Role:', user.role);
} catch (error) {
  console.error('Failed to get user:', error.message);
}
```

---

## Items

### List Items (GET /items)

Get a paginated list of items with optional filtering.

#### cURL

```bash
# List items with pagination
curl -X GET "https://api.example.com/items?page=1&perPage=20" \
  -H "Authorization: Bearer <TOKEN>"

# Filter by status
curl -X GET "https://api.example.com/items?status=active&page=1&perPage=10" \
  -H "Authorization: Bearer <TOKEN>"
```

#### JavaScript (fetch)

```javascript
const listItems = async (options = {}) => {
  const {
    page = 1,
    perPage = 20,
    status = null
  } = options;

  const token = localStorage.getItem('authToken');
  
  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString()
  });
  
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(`https://api.example.com/items?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return await response.json();
};

// Usage
try {
  const result = await listItems({ 
    page: 1, 
    perPage: 20, 
    status: 'active' 
  });
  
  console.log(`Showing ${result.items.length} of ${result.pagination.total} items`);
  result.items.forEach(item => {
    console.log(`- ${item.name} (${item.status})`);
  });
} catch (error) {
  console.error('Failed to list items:', error.message);
}
```

---

### Create Item (POST /items)

Create a new item.

#### cURL

```bash
curl -X POST https://api.example.com/items \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Item",
    "description": "This is a new item",
    "status": "active"
  }'
```

#### JavaScript (fetch)

```javascript
const createItem = async (itemData) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('https://api.example.com/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemData)
  });

  if (!response.ok) {
    if (response.status === 422) {
      const error = await response.json();
      throw new Error(`Validation error: ${JSON.stringify(error.error.details)}`);
    }
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return await response.json();
};

// Usage
try {
  const newItem = await createItem({
    name: 'New Item',
    description: 'This is a new item',
    status: 'active'
  });
  
  console.log('Item created:', newItem.id);
  console.log('Name:', newItem.name);
  console.log('Created at:', newItem.createdAt);
} catch (error) {
  console.error('Failed to create item:', error.message);
}
```

---

### Delete Item (DELETE /items/{id})

Delete an item by its ID.

#### cURL

```bash
curl -X DELETE https://api.example.com/items/item_456def \
  -H "Authorization: Bearer <TOKEN>"
```

#### JavaScript (fetch)

```javascript
const deleteItem = async (itemId) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`https://api.example.com/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Item not found');
    }
    const error = await response.json();
    throw new Error(error.error.message);
  }

  // 204 No Content - successful deletion
  return true;
};

// Usage
try {
  await deleteItem('item_456def');
  console.log('Item deleted successfully');
} catch (error) {
  console.error('Failed to delete item:', error.message);
}
```

---

## Complete Example: Full Workflow

Here's a complete example showing authentication followed by CRUD operations:

```javascript
class NexusNairAPI {
  constructor(baseURL = 'https://api.example.com') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async listItems(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/items?${query}`);
  }

  async createItem(data) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, { method: 'DELETE' });
  }
}

// Usage
const api = new NexusNairAPI();

(async () => {
  try {
    // Login
    await api.login('user@example.com', 'SecurePassword123');
    console.log('✓ Logged in');

    // Get user
    const user = await api.getUser('usr_123abc');
    console.log('✓ User:', user.name);

    // List items
    const items = await api.listItems({ status: 'active', perPage: 10 });
    console.log(`✓ Found ${items.items.length} items`);

    // Create item
    const newItem = await api.createItem({
      name: 'Test Item',
      description: 'Created via API',
      status: 'active'
    });
    console.log('✓ Created item:', newItem.id);

    // Delete item
    await api.deleteItem(newItem.id);
    console.log('✓ Deleted item');

  } catch (error) {
    console.error('✗ Error:', error.message);
  }
})();
```

---

## Error Handling Best Practices

Always handle errors gracefully:

```javascript
const handleAPIError = (error, response) => {
  if (!response) {
    // Network error
    console.error('Network error:', error.message);
    return;
  }

  switch (response.status) {
    case 401:
      console.error('Unauthorized - redirecting to login');
      // Redirect to login page
      break;
    case 404:
      console.error('Resource not found');
      break;
    case 422:
      console.error('Validation error:', error.error.details);
      break;
    case 429:
      console.error('Rate limit exceeded - please try again later');
      break;
    case 500:
      console.error('Server error - please contact support');
      console.error('Request ID:', error.error.requestId);
      break;
    default:
      console.error('API error:', error.error.message);
  }
};
```
