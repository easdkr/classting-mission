# 클래스팅 백엔드 사전 과제

### prerequisite

> docker compose v2
> node
> yarn

### usage

1. add `.env.development`

```
# example
APP_PORT=3000

DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=development
DATABASE_PORT=5432

PGADMIN_DEFAULT_EMAIL=test@pg.com
PGADMIN_DEFAULT_PASSWORD=postgres

SESSION_SECRET=1234a
REDIS_HOST=localhost
REDIS_PORT=6379
```

2. db container 실행

```bash
yarn start:db:dev
```
