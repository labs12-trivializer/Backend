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
    id: 1,
    name: 'true/false',
  },
  {
    id: 2,
    name: 'multiple choice',
  },
  {
    id: 3,
    name: 'fill-in the blank',
  },
];
```

# Resource: Games

# Resource: Rounds

```javascript
// GET /rounds
// example response body
[
  {
    id: 1,
    game_id: 1,
    timestamps: '2019-04-29 15:41:47',
    number: 5,
  },
  {
    id: 2,
    game_id: 1,
    timestamps: '2019-04-29 22:14:00',
    number: 4,
  },
  {
    id: 3,
    game_id: 1,
    timestamps: '2019-04-29 22:14:29',
    number: 4,
  },
];
```

```javascript
// GET by id /rounds/:id

// example request: GET to '/rounds/1'
//example response body:
 {
    id: 1,
    game_id: 1,
    timestamps: '2019-04-29 15:41:47',
    number: 5,
  }
```

```javascript
// POST /rounds
// example request body
{
	"game_id": 2,
	"number": 2
}

// example response body
{
  "id": 6,
  "game_id": 2,
  "timestamps": "2019-04-29 22:52:01",
  "number": 2
}
```

```javascript
// PUT /rounds/:id
// example request body to '/rounds/6' with updates:
{
	"game_id": 2,
	"number": 4
}

// example response body
{
  "id": 6,
  "game_id": 2,
  "timestamps": "2019-04-29 22:52:01",
  "number": 4
}
```

```javascript
// DELETE /rounds/:id
//Successfull delete returns:
{
  "message": "item deleted"
}

// Unsuccesful delete because item doesnt exist returns:
{
  "message": 'round does not exist, cannot delete'
}
```

# Resource: Questions

# Resource: Answers
