This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

You can get started by installing the dependencies by running:

```
yarn 
```

Then run and watch the dev environment with:

```
yarn dev
```

For formating the code using prettier up the code run:

```
yarn format
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local environment variables
Create a .env.local file in the folder /front
add the following environment variables

```
POSTGRESQL_ADDON_HOST=
POSTGRESQL_ADDON_DB=
POSTGRESQL_ADDON_USER=
POSTGRESQL_ADDON_PORT=
POSTGRESQL_ADDON_PASSWORD=
POSTGRESQL_ADDON_URI=
BASE_URL=http://localhost:3000
```

To access the PostgreSQL environment variables send a message to Frédérik VARLET on slack. He will give you access to Vaultwarden where they are stored. 

## Languages & tools

- [Next.js](https://nextjs.org) is used app rendering and links.
- [React](http://facebook.github.io/react) is used for interactive UI.
- [Tailwind CSS](https://tailwindcss.com/) is used for styling
- [Prettier](https://prettier.io/) is used for formatting
- [shadcn](https://ui.shadcn.com/) is used for ui components