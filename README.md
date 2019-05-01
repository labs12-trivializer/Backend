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
    id: 1,
    name: 'Handcrafted Concrete Table',
    created_at: '2019-04-30 02:54:13',
    updated_at: '2019-04-30 02:54:13',
    last_played: 1556518098409,
    user_id: 506,
    logo_url: 'http://lorempixel.com/640/480/business',
  },
  {
    id: 5,
    name: 'Handcrafted Frozen Shoes',
    created_at: '2019-04-30 02:54:13',
    updated_at: '2019-04-30 02:54:13',
    last_played: 1556531295844,
    user_id: 506,
    logo_url: 'http://lorempixel.com/640/480/business',
  },
];
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

**Returns:** an array of question objects that correspond with the `user_id`.

Example:

```js
[
  {
    id: 1,
    user_id: 1,
    question_type_id: 1,
    category_id: 1,
    text: 'A walrus makes what sound?',
    difficulty: 'Easy',
    timestamps: '2019-04-30 19:47:24',
    round_id: 1,
    user_id: 502
  },
  {
    id: 2,
    user_id: 1,
    question_type_id: 1,
    category_id: 1,
    text: 'What Philly celebrity would you want to have a drink with?',
    difficulty: 'Easy',
    timestamps: '2019-04-30 19:47:24',
    round_id: 1,
    user_id: 502
  },
];
```

## [GET] question by id

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in, User must own question.

**Returns:** an array of question objects.

Example:

```js
[
  {
    id: 2,
    user_id: 1,
    question_type_id: 1,
    category_id: 1,
    text: 'What Philly celebrity would you want to have a drink with?',
    difficulty: 'Easy',
    timestamps: '2019-04-30 19:47:24',
    round_id: 1,
    user_id: 502
  },
];
```

## [POST] new question

**URL:** `/api/questions`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  user_id: 1, // integer
  question_type_id: 1, // integer
  category_id: 2, // integer
  text: "What color pill does Neo take from Morpheus?", // string, max 128 chars, required
  difficulty: "Medium", // string, max 128 chars
  timestamps: "2019-04-30 21:35:22", // timestamp, optional
  round_id: 2, // integer
  user_id: 502 // integer
}
```

**Returns:** a new question object.

Example:

```js
{
  id: 7,
  user_id: 1,
  question_type_id: 1,
  category_id: 2,
  text: "What color pill does Neo take from Morpheus?",
  difficulty: "Medium",
  timestamps: "2019-04-30 21:35:22",
  round_id: 2,
  user_id: 502
}
```

## [PUT] question

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in.

**Payload:** an object with the following properties.

```js
{
  id: 7,
  user_id: 1,
  question_type_id: 1,
  category_id: 2,
  text: "Who does Neo take a colored pill from?",
  difficulty: "Medium",
  timestamps: "2019-04-30 21:35:22",
  round_id: 2,
  user_id: 502
}
```

**Returns:** an updated question object.

## [DELETE] question

**URL:** `/api/questions/:id`

**Restricted:** User must be logged in.

**Returns:** The deleted question object and a success message.

```js
{
  deleted: {
    id: 10,
    user_id: 1,
    question_type_id: 1,
    category_id: 1,
    text: "An example question should ask what?",
    difficulty: "Medium",
    timestamps: "2019-04-30 21:35:22",
    round_id: 2,
    user_id: 502
  },
  message: "Question deleted"
}
```

# Resource: Categories

## [GET] categories

**URL:** `/api/categories`

**Restricted:** User must be logged in.

**Returns:** an array of category objects.

Example:

```js
[
  {
    name: 'General Knowledge',
    category_id: 9,
  },
  {
    name: 'Celebrities',
    category_id: 26,
  },
];
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
    id: 1,
    question_id: 3,
    text: 'true',
    is_correct: true,
  },
  {
    id: 2,
    question_id: 3,
    text: 'false',
    is_correct: false,
  },
];
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

# Resource: Billing

## Create Customer with Stripe

## [POST] to `/api/billing/customer` with object similair to the one below. Does not have to be exact (stripe will create a new customer even if an empty object is sent). Other parameters include "description", "source", "metadata", etc. (https://stripe.com/docs/api/customers/create)

```js
{
  "name": "Test User",
  "email": "test325@testmail.com",
}
```

**Returns**

```js
{
  "id": "cus_EyxwhgzEAyOluE",
  "object": "customer",
  "account_balance": 0,
  "address": null,
  "created": 1556646307,
  "currency": null,
  "default_source": "card_1EV00tJSYEQ0YOhP97XWQ5to",
  "delinquent": false,
  "description": null,
  "discount": null,
  "email": "test325@testmail.com",
  "invoice_prefix": "57D4B657",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null
  },
  "livemode": false,
  "metadata": {},
  "name": "Test User",
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "sources": {
    "object": "list",
    "data": [
      {
        "id": "card_1EV00tJSYEQ0YOhP97XWQ5to",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "American Express",
        "country": "US",
        "customer": "cus_EyxwhgzEAyOluE",
        "cvc_check": null,
        "dynamic_last4": null,
        "exp_month": 4,
        "exp_year": 2020,
        "fingerprint": "FhzSRBK5EEpnIzaW",
        "funding": "credit",
        "last4": "8431",
        "metadata": {},
        "name": null,
        "tokenization_method": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/customers/cus_EyxwhgzEAyOluE/sources"
  },
  "subscriptions": {
    "object": "list",
    "data": [],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/customers/cus_EyxwhgzEAyOluE/subscriptions"
  },
  "tax_exempt": "none",
  "tax_ids": {
    "object": "list",
    "data": [],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/customers/cus_EyxwhgzEAyOluE/tax_ids"
  },
  "tax_info": null,
  "tax_info_verification": null
}
```

## Subscribe Customer to one of the two paid payment plans (silver or gold)

## [POST] to `/api/billing/subscribe` with object that includes customer (id in response above), and plan id:

```js
  {
	"customer": "cus_EyxwhgzEAyOluE",
	"plan": "plan_Eyw9DUPvzcFMvK"  //gold plan id
  }
```

**Returns**

```js
{
  "id": "sub_EyxxnzjeqZjffL",
  "object": "subscription",
  "application_fee_percent": null,
  "billing": "charge_automatically",
  "billing_cycle_anchor": 1556646341,
  "billing_thresholds": null,
  "cancel_at": null,
  "cancel_at_period_end": false,
  "canceled_at": null,
  "created": 1556646341,
  "current_period_end": 1588268741,
  "current_period_start": 1556646341,
  "customer": "cus_EyxwhgzEAyOluE",
  "days_until_due": null,
  "default_payment_method": null,
  "default_source": null,
  "default_tax_rates": [],
  "discount": null,
  "ended_at": null,
  "items": {
    "object": "list",
    "data": [
      {
        "id": "si_EyxxhoNMSQ4Hv0",
        "object": "subscription_item",
        "billing_thresholds": null,
        "created": 1556646342,
        "metadata": {},
        "plan": {
          "id": "plan_Eyw9DUPvzcFMvK",
          "object": "plan",
          "active": true,
          "aggregate_usage": null,
          "amount": 2999,
          "billing_scheme": "per_unit",
          "created": 1556639654,
          "currency": "usd",
          "interval": "year",
          "interval_count": 1,
          "livemode": false,
          "metadata": {},
          "nickname": "gold",
          "product": "prod_Eyw95cKae2d39F",
          "tiers": null,
          "tiers_mode": null,
          "transform_usage": null,
          "trial_period_days": null,
          "usage_type": "licensed"
        },
        "quantity": 1,
        "subscription": "sub_EyxxnzjeqZjffL",
        "tax_rates": []
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/subscription_items?subscription=sub_EyxxnzjeqZjffL"
  },
  "latest_invoice": "in_1EV01SJSYEQ0YOhPXstvNIrC",
  "livemode": false,
  "metadata": {},
  "plan": {
    "id": "plan_Eyw9DUPvzcFMvK",
    "object": "plan",
    "active": true,
    "aggregate_usage": null,
    "amount": 2999,
    "billing_scheme": "per_unit",
    "created": 1556639654,
    "currency": "usd",
    "interval": "year",
    "interval_count": 1,
    "livemode": false,
    "metadata": {},
    "nickname": "gold",
    "product": "prod_Eyw95cKae2d39F",
    "tiers": null,
    "tiers_mode": null,
    "transform_usage": null,
    "trial_period_days": null,
    "usage_type": "licensed"
  },
  "quantity": 1,
  "schedule": null,
  "start": 1556646341,
  "status": "active",
  "tax_percent": null,
  "trial_end": null,
  "trial_start": null
}
```
