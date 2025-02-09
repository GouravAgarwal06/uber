# API Documentation

## Endpoint: `/api/v1/user/register`

### Description
This endpoint is used to register a new user.

### Method
`POST`

### Request Body
The request body should be a JSON object containing the following fields:

- `email`: A valid email address (required)
- `password`: A password with a minimum length of 6 characters (required)
- `fullname`: An object containing:
  - `firstname`: A first name with a minimum length of 3 characters (required)
  - `lastname`: A last name with a minimum length of 3 characters (optional)

Example:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

### Responses

#### Success
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "email": "user@example.com",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      }
    }
  }
  ```

#### Validation Errors
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password",
        "location": "body"
      },
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```

#### User Already Exists
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "error": "User already exists"
  }
  ```

#### Missing Fields
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "error": "All fields are required"
  }
  ```

## Endpoint: `/api/v1/user/login`

### Description
This endpoint is used to log in an existing user.

### Method
`POST`

### Request Body
The request body should be a JSON object containing the following fields:

- `email`: A valid email address (required)
- `password`: A password with a minimum length of 6 characters (required)

Example:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "message": "User logged in successfully",
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "email": "user@example.com",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      }
    }
  }
  ```

#### Validation Errors
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Invalid Credentials
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### Missing Fields
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "error": "All fields are required"
  }
  ```
