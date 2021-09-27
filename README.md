# Simple NodeJS JWT Authorization

I explained how can we use JWT in Node.JS as simple.
Project not contain frontend so you can use Postman for testing api.

## Definition

Here we are performing login and register operations

Register Route:
`localhost:8000/api/user/register`

For the register, you need sending post value like below json data,

```
{
    "name": "Your name",
    "email": "Your email",
    "password": "Your password"
}
```

Login Route:
`localhost:8000/api/user/login`

The login operation, your json data like this, 

```
{
    "email": "Your email",
    "password": "Your password"
}
```

I used Joi for the validation the model values.


If user exist or we have get some error like invalid password or email , sending some values about the situation via res.send()


After that if there isn't any problem and user exist, I create token and adding the token to request header as 'auth-token.

Now, you can create some custom routes and use exported function in  verifyToken as middleware and testing the token :)