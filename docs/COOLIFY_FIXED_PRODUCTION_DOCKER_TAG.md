# Pravopoisk: permanent Docker image channel for Coolify

## One-time production application change

In Coolify `pravopoisk -> production -> pravopoisk-web-121-candidate`, leave:
- Docker Image: `ghcr.io/ymaslen77-tech/pravopoisk-military`
- Docker Image Tag: **`production`** (fixed indefinitely)
- Ports Exposes: `3000`
- Existing domain, Postgres `DATABASE_URL`, authentication/encryption keys, persistent volumes and `LEAD_ATTACHMENT_STORAGE_ROOT`: unchanged

Do not change old application `pravopoisk-web`. Do not change the database or persistent-volume settings.

## How new releases work

1. Build the code on a separate runner and publish an immutable release image, e.g.
   `ghcr.io/ymaslen77-tech/pravopoisk-military:rc-documents-121-34de8a4e`.
2. Confirm that the release passed required TypeScript, unit and browser checks.
3. Change the single line in `ops/production-image-tag.txt` via reviewed commit to the **approved** release tag and merge into `infra/coolify-russian-vps`.
4. `.github/workflows/promote-production-image.yml` publishes the same image under the fixed tag `:production`. This does **not** deploy or call Coolify and never rebuilds npm on the VPS.
5. After the promotion job finishes successfully, press **Redeploy** on the existing Docker Image application in Coolify. The Docker Image deployment pulls the current `:production` image and performs the replacement. Verify HTTP, key routes and generated drafts after redeploy.

**This removes all future manual Docker tag changes in Coolify.** New image build and release promotion are separate, deliberately auditable operations.

## Rollback

Keep the last successful immutable release tag and image digest in release notes. A rollback can temporarily set the Coolify image tag to that immutable previous tag and Redeploy, or promote that tag back to `:production` and Redeploy. Updating `:production` does not delete previous immutable `rc-*` tags.

## Note on mutable tags

Coolify pulls images on Docker Image deployments; a restart or Redeploy can pick up whatever `:production` currently references. Never promote untested images. No automatic redeploy should be triggered by merely publishing `:production` unless production safeguards and explicit authorization have been configured.
