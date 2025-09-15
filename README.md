# Chirpy
Lane is teaching me how to use TypeScript in server development. This follow-along-project was fun and challenging.

## Database
PostgreSQL is the database that is used. I have only ever worked with MySQL databases in the past, primiarly when working with WordPress projects. My knowledge of SQL is basic at this time and I am excited to learn more. I used [Drizzle](https://orm.drizzle.team/) to interact with the database in a code-first approach. Drizzle is SQL-like and the JavaScript code reads as SQL, so knowing SQL makes this library simple (for the most part) to use because there is not much of a 'syntax or framework' learning curve.

## Authentication
I rolled my own authentication process with email and passwords, and JWTs. This part of the project was the most challenging as I have never been exposed to the process of authenticating an end-user. Passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt). We compare that hashed version of the password with the bcrypt.compare function to the actual password string. As for JWTs, I generated a secret that is stored server side and not publically available. The JWTs are generated using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) using the jsonwebtoken functions sign and validate to assure the tokens are exactly how the server remembers them to be. I implemented refresh tokens based on a bearer token that is passed via an Authorization header in an HTTP request. I also added revocation funcationality of these refresh tokens.

## Webhooks
'Polka' is used as a 3rd party payment processor, that allows our users to upgrade to Chirpy Red. The /api/polka/webhooks endpoint sends a JSON payload to our server whenever an event happens (payment success) and on the server I handle the event by responding to the client with a 2xx status code, 204 in this case. This allows the client to know everything is well on our end and we no longer need to be in communication regarding this event. Now if the payment was not successful, or something goes wrong on our end, I respond to the client "Polka" with a 4xx error, in this case a 404. This lets the client know that we still need to be in communication regarding this event. They will continue to retry HTTP requests to our endpoint until the client recieces the 204 I discussed prior.
```
{
  "event": "user.upgraded",
  "data": {
    "userId": "3444ddddcvsdfg456456ysdfgsdfg43"
  }
}
```

## Testing
I used [vitest](https://vitest.dev/) to write test to test certain functions during the course of the project. An example is a function that extracts a bearer token from an Authorization header. This was also a new concept for me and I found it beneficial writing these tests as it helps you understand what your code is truly doing and knowing that potential bugs that could arise if we don't handle the cases.

## Documentation
As for documenting this project. I have just opted to talk about this project in this readme. I plan to build a project of my own that will require documentation and practice that skill there instead of here.