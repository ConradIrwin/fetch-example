# GitHub Fetch Worker

A Cloudflare Worker that fetches a GitHub artifact zip file and returns it to the client.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

## Usage

Once deployed or running locally, simply make a request to your worker URL to fetch the GitHub artifact:

```bash
curl http://localhost:8787/broken
```

This will fail because the token is forwarded to the upstream location.

```bash
curl http://localhost:8787/fixed
```

This will succeed because the token is not forwarded to the upstream location.
