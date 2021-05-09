![image](https://user-images.githubusercontent.com/66072316/117555410-3c996680-b05f-11eb-8a1f-6601a55efcc4.png)
# EXPRESS APP 

Pro spuštění aplikace je potřeba mít vytvořené .env proměnné. Proměnné je třeba vytvořit ve složce config v souboru dev.env:
- PORT - port, na kterém aplikace naslouchá
- DB_URL - url adresa pro připojení na mongoDB databázi
- JWT_SEC - secret string pro vytvoření a porovnávání jwt tokenu při autentizaci

1. spuštění příkazu ```npm install ```
2. spuštění aplikace ```npm run dev``` (je možno změnit v package.json)

endpointy je také možné otestovat na adrese: ```https://express-app-test-jakub-vala.herokuapp.com```

# ENDPOINTS
----------------------------------------------------------------
## Kontrola spuštění aplikace

GET: ```{{ur}}/```

Response 200:
```
Application running
```


## 1. Vytvoření uživatele a tokenu k uživateli
POST: ```{{url}}/users/create```

Header:
- ```Content-Type: 'application/json'```

Body:
```
{
    "email": "jakub.valaa@seznam.cz",
    "password": "kuba123"
}
```
Response 200:
```
{
    "user": {
        "_id": "6097066b7e92c67e708243c8",
        "email": "jakub.valaa@seznam.cz",
        "createdAt": "2021-05-08T21:45:15.235Z",
        "updatedAt": "2021-05-08T21:45:15.312Z",
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDk3MDY2YjdlOTJjNjdlNzA4MjQzYzgiLCJpYXQiOjE2MjA1MTAzMTV9.XmHXOQH0ZlFsEB-WTlDVadk2nOj6UHGJophBwTnwBU0"
}
```
Response 400:
```
{
    "error": "E11000 duplicate key error collection: express-app.users index: email_1 dup key: { email: \"jakub.valaa@seznam.cz\" }"
}
```



## 2. Vytvoření nového tokenu pro uživatele
POST: ```{{url}}/users/login```

Header: ```Content-Type: 'application/json'```

Body: 
```
{
    "email": "jakub.valaa@seznam.cz",
    "password": "kuba123"
}
```

Response 200:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDk3MGE0YmYxNzY3MDVkMzgwZGM2NGUiLCJpYXQiOjE2MjA1MTE4MjF9.A5dPiVzrn-cW83_G6YHZ1hBrwcw5inlMBmhG2pXud-M",
    "user": {
        "_id": "60970a4bf176705d380dc64e",
        "email": "jakub.valaa@seznam.cz",
        "createdAt": "2021-05-08T22:01:47.136Z",
        "updatedAt": "2021-05-08T22:10:21.682Z",
        "__v": 11
    }
}
```



## 3. Odebrání aktuálního tokenu

POST: ```{{url}}/users/logout```

Header: ```Content-Type: 'application/json', Authorization: 'Bearer {{authToken}}'```

Response 401:
```
{
    "err": "Nutné přihlášení!"
}
```



## 4. Odebrání všech tokenů

POST: ```{{url}}/logout/all```

Header: ```Content-type: 'application/json', Authorization: 'Bearer {{authToken}}'```

Response 401:
```
{
    "err": "Nutné přihlášení!"
}
```



## 5. Odebrání uživatele

DELETE: ```{{url}}/users/delete```

Header: ```Content-Type: 'application/json', Authorization: 'Bearer {{authToken}}'```

Response 401:
```
{
    "err": "Nutné přihlášení!"
}
```



## 6. Kontrola platnosti a stavu kreditní karty

GET: ```{{url}}/card/:id```

Header: ```Content-type: 'application/json', Authorization: 'Bearer {{authToken}}'```

Params: ```id``` - číslo kreditní karty


Response 200:
```
{
    "valid": {
        "validity_start": "2016-08-12T00:00:00",
        "validity_end": "2020-08-12T00:00:00"
    },
    "state": {
        "state_id": 100,
        "state_description": "Aktivní v držení klienta"
    }
}
```

Response 400:
```
Neplatné číslo kreditní karty.
```

Response 401:
```
{
    "err": "Nutné přihlášení!"
}
```
# Unit testy
![jest](https://user-images.githubusercontent.com/66072316/117577847-d0b10f80-b0eb-11eb-9cbf-04b00e871839.png)
- unit testy pomocí frameworku jest
- před spuštěním se vytvoří soubor test.env ve složce config
- do souboru test.env se vloží proměnné JWT_SEC (secret pro vytvoření jwt), DB_URL (url pro připojení na mongoDB), CRD (číslo platné kreditní karty)
- test se spustí příkazem ```npm run test```

![image](https://user-images.githubusercontent.com/66072316/117577994-811f1380-b0ec-11eb-94d8-68f380089411.png)



