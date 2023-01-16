# NodeJS global mentoring program

## 👀 Package scripts

Scripts available in **package.json**.

- `build` - build TypeScript app
- `watch` - run TypeScript app in watch mode
- `start` - build and launch project
- `run:dev` - run app in development mode using nodemon
- `lint` - displays lint errors
- `lint:fix` - fix lint errors

## Supported operations:

- `POST` on the endpoint `/users` (create a new user)

**Request example:**
```
{
    "login": "testlogin@gmail.com",
    "password": "testpass",
    "age": 52
}
```


- `GET` on the endpoint `/users/:id` (get a specific user)

**Response example:**
```
{
    "id": "9f25fa2a-b9f8-4d05-bab8-d52f8a78a5ba",
    "isDeleted": false,
    "login": "testlogin@gmail.com",
    "password": "testpass",
    "age": 52
}
```


- `PUT` on the endpoint `/users/:id` (update the data for a specific user)

**Request example:**
```
{
    "login": "updatedmail@gmail.com",
    "password": "updatedpass",
    "age": 67
}
```


- `DELETE` on the endpoint `/users/:id` (remove a specific user)

**Response headers example:**
```
status: 204 No Content
```


- `Auto suggest` on the endpoint `users/?login=loginSubstring&limit=10`

**Request URL example:**
```
http://localhost:3000/users/?login=test&limit=10
```
**Response example:**
```
[
    {
        "id": "59c84191-c2ca-45f1-8a05-0172a7be5f42",
        "isDeleted": false,
        "login": "testlogina@gmail.com",
        "password": "testpass",
        "age": 52
    },
    {
        "id": "71a77be0-d915-4d4d-8cec-5ef7bece120b",
        "isDeleted": false,
        "login": "testloginc@gmail.com",
        "password": "testpass",
        "age": 52
    }
]
```
