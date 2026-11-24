# ShipLog

A small pipeline status board: an Express API (`/health`, `/api/pipelines`, `/api/pipelines/:id`, `POST /api/pipelines/:id/runs`) and a static page that lists pipelines with their status, success rate and median duration.

```bash
npm ci
npm test
npm start   # http://localhost:3000
```

## Supply-chain checks

This repository is the live demo target for **Software Supply Chain Guardian** (Bosch BGSW hackathon). Every pull request triggers `.github/workflows/guardian.yml`, which hands the PR to a Guardian server on a self-hosted runner. Guardian reports two commit statuses:

- `guardian/scan`: is this change safe to merge? (required by branch protection)
- `guardian/validation`: was the proposed fix verified in an isolated build?

Guardian never checks out or runs pull-request code on the runner, never merges, and never pushes on its own. A nightly job (`guardian-nightly.yml`) re-checks `main` against newly published advisories.
