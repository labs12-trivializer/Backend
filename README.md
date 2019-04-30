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

## [GET] all user's games

**URL:** `/api/games`

**Restricted:** User must be logged in.

**Returns:** an array of game objects.

Example:

```js
[
 {
    "id": 1,
    "name": "Handcrafted Concrete Table",
    "created_at": "2019-04-30 02:54:13",
    "updated_at": "2019-04-30 02:54:13",
    "last_played": 1556518098409,
    "user_id": 506,
    "logo_url": "http://lorempixel.com/640/480/business"
  },
  {
    "id": 5,
    "name": "Handcrafted Frozen Shoes",
    "created_at": "2019-04-30 02:54:13",
    "updated_at": "2019-04-30 02:54:13",
    "last_played": 1556531295844,
    "user_id": 506,
    "logo_url": "http://lorempixel.com/640/480/business"
  },
]
```

## [GET] game by id

**URL:** `/api/games/:id`

**Restricted:** User must be logged in, User must own game.

**Returns:** an array of game objects.

Example:

```js
{
  "id": 6,
  "name": "Rustic Concrete Hat",
  "created_at": "2019-04-30 16:16:20",
  "updated_at": "2019-04-30 16:16:20",
  "last_played": 1556583501055,
  "user_id": 506,
  "logo_url": "http://lorempixel.com/640/480/business"
}
```

## [POST] new game

**URL:** `/api/games`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "name": "test game name", // string, limit 128 chars, required
  "last_played": "1556443408624", // timestamp, optional
  "logo_url": "http://lorempixel.com/640/480/business" // string, valid uri format, optional
}
```

**Returns:** a new game object.

Example:

```js
{
  "id": 412,
  "name": "test game name",
  "created_at": "2019-04-30 05:42:13",
  "updated_at": "2019-04-30 05:42:13",
  "last_played": 1556443408624,
  "user_id": 506,
  "logo_url": "http://lorempixel.com/640/480/business"
}
```

## [PUT] game

**URL:** `/api/games/:id`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "name": "test game name", // string, limit 128 chars, required
  "last_played": "1556443408624", // timestamp, optional
  "logo_url": "http://lorempixel.com/640/480/business" // string, valid uri format, optional
}
```

**Returns:** an updated game object.

## [DELETE] game

**URL:** `/api/games/:id`

**Restricted:** User must be logged in.

**Returns:** a success message.

```js
{
  "id": 5,
  "message": "Game deleted."
}
```

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

## [GET] all user's questions

**URL:** `/api/questions`

**Restricted:** User must be logged in.

**Returns:** an array of question objects.

Example:

```js
[
  {
    "id": 1,
    "user_id": 1,
    "question_type_id": 1,
    "category_id": 1,
    "text": "A walrus makes what sound?",
    "difficulty": "Easy",
    "timestamps": "2019-04-30 19:47:24",
    "round_id": 1
  },
  {
    "id": 2,
    "user_id": 1,
    "question_type_id": 1,
    "category_id": 1,
    "text": "What Philly celebrity would you want to have a drink with?",
    "difficulty": "Easy",
    "timestamps": "2019-04-30 19:47:24",
    "round_id": 1
  },
]
```

## [GET] question by id

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in, User must own question.

**Returns:** an array of question objects.

Example:

```js
[
  {
    "id": 2,
    "user_id": 1,
    "question_type_id": 1,
    "category_id": 1,
    "text": "What Philly celebrity would you want to have a drink with?",
    "difficulty": "Easy",
    "timestamps": "2019-04-30 19:47:24",
    "round_id": 1
  }
]
```

## [POST] new question

**URL:** `/api/questions`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "user_id": 1, // integer
  "question_type_id": 1, // integer
  "category_id": 2, // integer
  "text": "What color pill does Neo take from Morpheus?", // string, max 128 chars, required
  "difficulty": "Medium", // string, max 128 chars
  "timestamps": "2019-04-30 21:35:22", // timestamp, optional
  "round_id": 2 // integer
}
```

**Returns:** a new question object.

Example:

```js
{
  "id": 7,
  "user_id": 1,
  "question_type_id": 1,
  "category_id": 2,
  "text": "What color pill does Neo take from Morpheus?",
  "difficulty": "Medium",
  "timestamps": "2019-04-30 21:35:22",
  "round_id": 2
}
```

## [PUT] question

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "id": 7,
  "user_id": 1,
  "question_type_id": 1,
  "category_id": 2,
  "text": "Who does Neo take a colored pill from?",
  "difficulty": "Medium",
  "timestamps": "2019-04-30 21:35:22",
  "round_id": 2
}
```

**Returns:** an updated question object.

## [DELETE] question

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in.

**Returns:** a success message.

```js
{
  "deleted": {
    "id": 10,
    "user_id": 1,
    "question_type_id": 1,
    "category_id": 1,
    "text": "An example question should ask what?",
    "difficulty": "Medium",
    "timestamps": "2019-04-30 21:35:22",
    "round_id": 2
  },
  "message": "Question deleted"
}
```

# Resource: Answers

## [GET] answer by _question_ id

**URL:** `/api/answers/:id`

**Restricted:** User must be logged in.

**Returns:** an array of answer objects.

Example:

```js
[
  {
    "id": 1,
    "question_id": 3,
    "text": "true",
    "is_correct": true,
  },
  {
    "id": 2,
    "question_id": 3,
    "text": "false",
    "is_correct": false
  }
]
```

## [POST] new answer

**URL:** `/api/answers`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "question_id": 1,   // number, foreign key, required
  "text": "yes",      // string, max 128 chars, required
  "is_correct": true  // boolean, required
}
```

**Returns:** a new answer object.

Example:

```js
{
  "id": 1,
  "question_id": 1,
  "text": "yes",
  "is_correct": true
}
```

## [PUT] answer

**URL:** `/api/answers/:id`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  "question_id": 1,   // number, foreign key, required
  "text": "yes",      // string, max 128 chars, optional
  "is_correct": true  // boolean, optional
}
```

**Returns:** an updated answer object.

## [DELETE] answer

**URL:** `/api/answers/:id`

**Restricted:** User must be logged in.

**Returns:** a success message.

```js
{
  "id": 5,
  "message": "Answer deleted."
}
```
