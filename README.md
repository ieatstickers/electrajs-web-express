# @electra/web-express

`@electra/web-express` is an implementation of the `@electra/web` package for use with ExpressJS.

It provides a set of adaptors to seamlessly interface `@electra/web`'s abstracted request and response
handling with ExpressJS's native request and response objects. This package facilitates the use of `@electra/web` in
ExpressJS applications, enabling developers to leverage the framework-agnostic capabilities of `@electra/web`
while utilizing ExpressJS's powerful features.


## Installation

Using npm:

```bash
npm install @electra/web-express
```

Using yarn:

```bash
yarn add @electra/web-express
```

## Usage

Classes are exported as named exports from `@electra/web-express`.

```typescript
import express from 'express';
import { RequestInterface, ResponseInterface } from '@electra/web';
import { Adaptor } from '@electra/web-express';
import { MyEndpoint } from './Endpoint/MyEndpoint';

const app = express();
const adaptor = new Adaptor();

// The adaptor's middleware method returns a middleware function that can be used with ExpressJS
app.use(adaptor.middleware((req, res, next) => {
  // req is an implementation of @electra/web's RequestInterface
  // res is an implementation of @electra/web's ResponseInterface
  next();
}));

// The adaptor's route method returns a route handler function that can be used with ExpressJS
app.get('/test', adaptor.route((req, res) => {
  // req is an implementation of @electra/web's RequestInterface
  // res is an implementation of @electra/web's ResponseInterface
}));

// The adaptor's endpoint method returns a route handler function that can be used with ExpressJS
// It automatically hydrates the endpoint's payload from the route params, query params and request body
// It also automatically serializes the response and sends it back to the client
app.get('/my-endpoint', adaptor.endpoint(MyEndpoint));


// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

```
