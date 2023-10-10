This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- Server-side rendering with Next.js
- TypeScript support
- Build and download PDF

## PDF Download Feature

This project includes a feature that allows users to download a PDF file containing crime arrest data for the state of Alaska. To download the PDF, click the "Print" button on the home page.

The PDF is generated on the server using the [pdfkit](https://github.com/foliojs/pdfkit) library, and includes a chart of the crime arrest data over the years.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[PDF API routes] can be accessed on [http://localhost:3000/api/pdf](http://localhost:3000/api/pdf). This endpoint can be edited in `pages/api/pdf/index.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
