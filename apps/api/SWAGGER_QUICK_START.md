# Swagger Quick Start Guide

## 🚀 Getting Started

### 1. Start the API Server

```bash
cd apps/api
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Access Swagger UI

Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

You should see the interactive Swagger UI with all API endpoints documented.

## 🔐 Testing Authenticated Endpoints

### Step 1: Create an Account

1. In Swagger UI, find the **Auth** section
2. Click on `POST /api/auth/signup`
3. Click "Try it out"
4. Enter the request body:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "phone": "+1234567890"
}
```
5. Click "Execute"
6. Copy the `accessToken` from the response

### Step 2: Authorize

1. Click the **"Authorize"** button at the top of the page (🔓 icon)
2. In the "Value" field, enter: `Bearer YOUR_ACCESS_TOKEN`
   - Replace `YOUR_ACCESS_TOKEN` with the token you copied
3. Click "Authorize"
4. Click "Close"

### Step 3: Test Authenticated Endpoints

Now you can test any endpoint that requires authentication! For example:

#### Create a Business
1. Find `POST /api/businesses`
2. Click "Try it out"
3. Enter:
```json
{
  "name": "My Test Business",
  "businessType": "retail",
  "timezone": "America/New_York",
  "currency": "USD"
}
```
4. Click "Execute"

#### Get Your Businesses
1. Find `GET /api/businesses`
2. Click "Try it out"
3. Click "Execute"
4. You should see the business you just created

## 📋 Common Workflows

### Workflow 1: User Registration and Login

```
1. POST /api/auth/signup → Get access token
2. Use token to authorize
3. GET /api/users/{id} → Get your user info
```

### Workflow 2: Create and Manage Business

```
1. POST /api/auth/login → Get access token
2. Authorize with token
3. POST /api/businesses → Create a business
4. GET /api/businesses → List your businesses
5. GET /api/businesses/{businessId} → Get specific business
6. PUT /api/businesses/{businessId} → Update business
```

### Workflow 3: Invite and Manage Members

```
1. Login and authorize
2. POST /api/businesses/{businessId}/members → Invite a member
3. GET /api/businesses/{businessId}/members → List all members
4. PATCH /api/businesses/{businessId}/members/{memberId}/role → Change member role
5. DELETE /api/businesses/{businessId}/members/{memberId} → Remove member
```

## 🎯 Quick Test Scenarios

### Scenario 1: Complete User Journey

```bash
# 1. Signup
POST /api/auth/signup
{
  "email": "john@example.com",
  "password": "secure123",
  "name": "John Doe"
}

# 2. Create Business (use token from signup)
POST /api/businesses
{
  "name": "John's Coffee Shop",
  "businessType": "food_service",
  "currency": "USD"
}

# 3. Invite Team Member
POST /api/businesses/{businessId}/members
{
  "email": "jane@example.com",
  "name": "Jane Smith",
  "role": "member"
}

# 4. List Members
GET /api/businesses/{businessId}/members
```

### Scenario 2: Token Refresh

```bash
# 1. Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secure123"
}
# Save both accessToken and refreshToken

# 2. When access token expires, refresh it
POST /api/auth/refresh
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
# Get new access token
```

## 🔍 Exploring the API

### View All Endpoints
- Endpoints are organized by tags: **Auth**, **Users**, **Businesses**, **Members**
- Click on any tag to expand/collapse its endpoints

### View Request Schema
- Click on any endpoint
- Click "Try it out"
- The request body schema is shown with example values

### View Response Schema
- Scroll down in any endpoint
- Check the "Responses" section
- Each status code shows its response schema

## 💡 Tips

1. **Use the Models section**: Scroll to the bottom to see all data schemas
2. **Copy curl commands**: After executing a request, you can copy the curl command
3. **Download OpenAPI spec**: Access `http://localhost:3000/api-docs.json` for the raw spec
4. **Test error cases**: Try invalid data to see error responses
5. **Check required fields**: Required fields are marked with a red asterisk (*)

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure you've clicked "Authorize" and entered your token
- Token format should be: `Bearer YOUR_TOKEN` (with space after Bearer)
- Check if your token has expired (login again to get a new one)

### "Forbidden" Error
- You don't have permission for this action
- Some endpoints require admin role
- Check the endpoint description for required permissions

### "Not Found" Error
- Check if the resource ID is correct
- Make sure the resource exists (create it first if needed)

### Server Not Running
- Make sure you ran `npm run dev` in the `apps/api` directory
- Check if port 3000 is available
- Look for error messages in the terminal

## 📚 Next Steps

- Read the full [Swagger Documentation](./SWAGGER_DOCUMENTATION.md)
- Explore all available endpoints in the Swagger UI
- Test different scenarios and edge cases
- Integrate the API with your frontend application

## 🎉 Happy Testing!

You're all set! Start exploring the API through the interactive Swagger UI.
