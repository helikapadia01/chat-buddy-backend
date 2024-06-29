# Chat Buddy Backend

This is the backend for the Chat Buddy application, built with Node.js, Express, and MongoDB. It handles user authentication, chat completion using OpenAI's GPT model, and various user-related operations.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [Linting](#linting)
- [API Endpoints](#api-endpoints)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/helikapadia01/chat-buddy-backend.git
   cd chat-buddy-backend
   ```

# chat-buddy-backend

2. **Install dependencies:**
   `npm install`

## Configuration

1. **Create a .env file in the root directory and add the following environment variables**

   ```NODE_ENV=development
       PORT=5000
       MONGO_URI=mongodb://localhost:27017/chatbuddy
       JWT_SECRET=your_jwt_secret
       COOKIE_NAME=chatbuddy_cookie
       OPENAI_API_KEY=your_openai_api_key

   ```

2. **Ensure MongoDB is running locally or provide a connection string to a remote MongoDB instance.**

## Running the server

1. **Start the server**

   ```bash
       npm start

   ```

2. **The server will start on the port specified in the .env file. By default, it will run on http://localhost:3000**

## Testing

1. **Run Tests**
   ```bash
       npm test
   ```

## Linting

1. **Lint the code:**

   ```bash
       npm run lint

   ```

2. **Automatically fix linting errors:**
   ```bash
       npm run lint:fix
   ```

## API Endpoints

## User Routes

### GET `/users`

Retrieve all users.

**Response:**

- Status: `200 OK`
- Body:
  ```json
  {
    "message": "OK",
    "users": []
  }
  ```

### POST `\signup`

Register a new user.

- Content-Type: `application/json`
- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
    "name": "John Doe",
    "email": "john.doe@gmail.com"
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User already registered`

### POST `\login`

Login a user.

- Content-Type: `application/json`
- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
    "token": "jwt_token"
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User not registered`

- Status: `403 Forbidden`
- Message: `Incorrect Password`

### GET `/verify`

Retrieve all users.

**Response:**

- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User not registered or Token malfunctioned`

- Status: `401 Unauthorized`
- Message: `Permissions didn't match`

- Status: `500 Internal Server Error`
- Message: `Internal Server Error`

### POST `\logout`

Login a user.

- Content-Type: `application/json`
- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User not registered or Token malfunctioned`

- Status: `401 Unauthorized`
- Message: `Permissions didn't match`

- Status: `500 Internal Server Error`
- Message: `Internal Server Error`

## Chat Routes

### POST `\generateChatCompletion`

Generate chat completion using OpenAI's GPT model.

- Content-Type: `application/json`
- Status: `200 OK`
- Example:
    ```json
    {
        "message": "hello"
    }
    ```

- Body:
  ```json
  {
    {
        "chats": [
            {
            "role": "user",
            "content": "Hello"
            },
            {
            "role": "assistant",
            "content": "Hi! How can I assist you today?"
            }
        ]
    }
  }
  ```

- Error Responses
- Status: `500 Internal Server Error`
- Body: 
```json
    {
        "message": "Something went wrong. Please try again."
    }
```

### GET `/sendChatsToUser`

Send chats to the user

**Response:**

- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
    "chats": []
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User not registered or Token malfunctioned`

- Status: `500 Internal Server Error`
- Message: `ERROR`

### DELETE `/deleteChats`

Send chats to the user

**Response:**

- Status: `200 OK`
- Body:

  ```json
  {
    "message": "OK",
  }
  ```

- Error Responses
- Status: `401 Unauthorized`
- Message: `User not registered or Token malfunctioned`

- Status: `401 Unauthorized`
- Message: `Permissions didn't match`

- Status: `500 Internal Server Error`
- Message: `ERROR`
