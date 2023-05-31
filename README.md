# Fund Control 

Under development


# Quickstart

## Development


- Install all dependencies

  ```sh 
  npm install
  ```

- This step only applies if you've opted out of having the CLI install dependencies for you:
   
  ```sh
  npx remix init
  ```

- Init db
  ```sh
    npx prisma db seed
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

# Deployment 

- `fly launch`
- `fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app fund-control-test-123`
- `fly volumes create data --size 1 --app fund-control-test-123`
- `fly deploy`
