# API documentation

# Resource: Authentication

# Resource: Users

```javascript
// POST /users
// request that should happen after successful auth0 authentication
// creates a user if one doesn't exist for this token's auth0_id

// example request body
{
  "tier_id": 3,
  "email": "valid@email.com",
  "logo_url": "http://nope.com/nope.jpg",
  "avatar_url": "http://nope.com/nope.jpg",
}

// example response body
{
  "id": 506,
  "tier_id": 3,
  "tier_name": "gold",
  "email": "valid@email.com",
  "logo_url": "http://nope.com/nope.jpg",
  "avatar_url": "http://nope.com/nope.jpg",
  "auth0_id": "auth0|1234"
}
```

```javascript
// GET /users/my_profile
// get the user's current profile

// example response body
{
  "id": 506,
  "tier_id": 3,
  "tier_name": "gold",
  "email": "valid@email.com",
  "logo_url": "http://nope.com/nope.jpg",
  "avatar_url": "http://nope.com/nope.jpg",
  "auth0_id": "auth0|1234"
}
```

```javascript
// PUT /users/my_profile
// update current user's profile

// example request body
{
  "email": "valid@email.com",
  "logo_url": "http://nope.com/nope.jpg",
  "avatar_url": "http://nope.com/nope.jpg"
}

// example response
{
  "id": 506,
  "tier_id": 3,
  "tier_name": "gold",
  "email": "valid@email.com",
  "logo_url": "http://nope.com/nope.jpg",
  "avatar_url": "http://nope.com/nope.jpg",
  "auth0_id": "auth0|1234"
}
```

# Resource: QuestionTypes

```javascript
// GET /question_types
// get all possible question_types

// example response body
[
  {
    "id": 1,
    "name": "true/false"
  },
  {
    "id": 2,
    "name": "multiple choice"
  },
  {
    "id": 3,
    "name": "fill-in the blank"
  }
]
```
# Resource: Games

# Resource: Rounds

# Resource: Questions

# Resource: Answers
