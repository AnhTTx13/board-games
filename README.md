# Board-games

Retro games application built with NestJS MVC.

## Getting Started


**Prerequisites:**

- `Nodejs` version >= 20

- [Docker](https://www.docker.com/get-started/) or [Postgresql](https://www.postgresql.org/download/) installed

**Clone the repository:**

```sh
git clone https://github.com/AnhTTx13/board-games
cd board-games
```

**Set up:**

- If you have Docker installed, just run one command:

```sh
  # ../board-games
  docker compose up
```

- If not, following this:

  1. Set up your Postgres database first
  2. Go to ./src/app.module.ts, uncomment the code block from line 20 to line 29 and edit with your corresponding database configurations
  3. Comment the code block from line 32 to line 41
  4. Run the commands:

  ```sh
  npm install
  npm run build
  npm run start:prod
  ```


**Note\*:** 

- In the Caro game, you first need to enter the room name and click `Enter room` button. If the room has 2 players, the game will start immediately.
