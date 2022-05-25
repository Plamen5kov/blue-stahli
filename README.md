# blue-stahli
experimenting with puppeteer

## prerequisites

You need to have docker installed. As of now I'm using `Docker version 20.10.16, build aa7e414` ubuntu version.

If you want to develop you'd need to have nodejs installed. As of now I'm using: `v16.13.0` that's `LTS`

`.env` and `.env.dev` files used for `docker-compose.yml` and `docker-compose.dev.yml` respectively. They should be placed in the root folder of the project as siblings to the `docker-compose` files.

example `.env.dev` `.env`:

```
HOST=postgres
PORT=5000

DB_PASSWORD=asdf12345r12d1d!@R!@T%
DB_USER=root
DB=glassdoor
DB_DIALECT=postgres

APP_ENV=development
```


## how to develop:

`git clone git@github.com:Plamen5kov/blue-stahli.git`

`cd blue-stahli`

`sudo docker-compose -f docker-compose.dev.yml --env-file ./.env.dev  up --build -d`


## how to run

`sudo docker-compose up --build -d`

## Docker running processes

`reddis` process runs because the `bull` library needs it to handle parallel content jobs

`postgres` this is the db used to save all the aquired user data

`backend` the server providing the endpoints

## API

Look for examples in the `blue-stahli.postman_collection.json` in the root folder of this project. You'll need to set an environment variable: `BASE_URL` to `localhost:5001/api/v1`

**Run a job to get user content from glassdor and save info in a database.**

1.1 endpoint

```
GET {{BASE_URL}}/contentProvider
```

1.2 url-encoded-parameters:

* `url` the site login page
* `username`: username for login
* `password` password for login

1.3 return

The endpoint will give you back a `JOB_ID` that you'll be able to use in the next endpoint to check the status of your job.

**Get running job status**

After you've started a job, you can check it's status by using the `JOB_ID` provided by the `contentProvider` endpoint.

1.1 endpoint

```
GET {{BASE_URL}}/job/[JOB_ID]
```

1.3 return

if successfull

```
{
    "jobStatus": {
        "id": "a50a7998-318b-446a-89e1-43cd2c43233c",
        "status": "done",
        "errMessage": {},
        "createdAt": "2022-05-25T03:51:14.018Z",
        "updatedAt": "2022-05-25T03:51:25.243Z",
        "deletedAt": null
    }
}
```

if still running

```
{
    "jobStatus": {
        "id": "a50a7998-318b-446a-89e1-43cd2c43233c",
        "status": "active",
        "errMessage": {},
        "createdAt": "2022-05-25T03:51:14.018Z",
        "updatedAt": "2022-05-25T03:51:25.243Z",
        "deletedAt": null
    }
}
```


if you try to save data for an already existing email

```
{
    "jobStatus": {
        "id": "06202d50-fe59-4277-9f11-28b6bf7a92e9",
        "status": "db error",
        "errMessage": {
            "msg": [
                {
                    "path": "email",
                    "type": "unique violation",
                    ...
                    ...

```

if you fail to login:

```
{
    "jobStatus": {
        "id": "f4794e2b-5912-4cf1-a568-4599eebbc8e3",
        "status": "pupeteer error",
        "errMessage": {
            "msg": "Error: something happened: Unable to login: check credentials: Navigation timeout of 30000 ms exceeded"
        },
        "createdAt": "2022-05-25T04:32:39.687Z",
        "updatedAt": "2022-05-25T04:33:13.288Z",
        "deletedAt": null
    }
}
```

**Query extracted user info**

1.1 endpoint

```
GET {{BASE_URL}}/users/
```

1.2 query params:

* if no query parameters are provided all users and their information will be returned
* `email` sarch for user by email

1.3 return

```
{
    "user": [
        {
            "id": "2bac72e0-af75-44be-b598-ddbabef7d614",
            "name": "Ravi Van",
            "email": "ravi.van.test@gmail.com",
            "about": "I am a software engineer with a particular interest in making things simple and automating daily tasks. I try to keep up with security and best practices, and am always looking for new things to learn.",
            "pdfPath": "/app/services/Ravi_Van.pdf",
            "experiences": [
                {
                    "id": 1,
                    "title": "Senior Software Engineer",
                    "employer": "Hastha Solutions",
                    "location": "London, England (UK)",
                    "employmentperiods": "Jan 2018 - Sep 2020",
                    "description": "..."
                },
                {
                    "id": 2,
                    "title": "Software Engineer",
                    "employer": "US Postal Service",
                    "location": "Washington, DC (US)",
                    "employmentperiods": "Sep 2014 - Jan 2018",
                    "description": "..."
                }
            ],
            "certifications": [
                {
                    "id": 1,
                    "title": "Azure Cloud Developer",
                    "employer": "Microsoft",
                    "certificationperiod": "Feb 2018 - Feb 2022",
                    "description": "Attended a 2-week seminar with workshops and exams."
                }
            ],
            "educations": [
                {
                    "id": 1,
                    "university": "London Engineering School",
                    "degree": "Bachelor's Degree, Information Technology",
                    "location": "London, England (UK)",
                    "graduationDate": "Oct 2009 - Sep 2014",
                    "description": "Updated education"
                }
            ],
            "Skills": [
                {
                    "id": 1,
                    "name": "C#.NET",
                    "createdAt": "2022-05-25T03:51:25.236Z",
                    "updatedAt": "2022-05-25T03:51:25.236Z",
                    "deletedAt": null,
                    "SdgGoalsToHumanRightsMap": {
                        "UserId": "2bac72e0-af75-44be-b598-ddbabef7d614",
                        "SkillId": 1
                    }
                }
                ...
            ]
        }
    ]
}
```


**Query extracted user info**

1.1 endpoint

```
{{BASE_URL}}/downloadPdf/?email=user_email@email.com
```

1.2 query params:

* `email` sarch for pdf by user email

1.3 return

the pdf file

## Database models

![Screenshot from 2022-05-25 08-39-10](https://user-images.githubusercontent.com/5918351/170188119-83aa2614-edee-4f1a-82fb-92e5d2baa7f9.png)

`user` many to many `skills` << so if more unique users are added the skills table can be reused

`user` one to many `education`

`user` one to many `certification`

`user` one to many `experience`
