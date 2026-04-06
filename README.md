# To-Do (scale-out)

This repo contains a React To-Do app (`todo/`) and an optional local infra stack:

- **Load balancer**: Nginx (`lb`)
- **Distributed instances**: 2 app containers (`app1`, `app2`)
- **Partition / canary routing (phân dải)**: header-based routing example (`X-Canary`)

## Run locally

Prerequisites: Docker Desktop (Compose v2).

```bash
docker compose up --build
```

Open:

- App via load balancer: `http://localhost:8080`

## Canary / partition routing (phân dải)

Normal traffic is load-balanced across instances.

To route a client into the "canary bucket" logic, send header `X-Canary: 1`:

```bash
curl -H "X-Canary: 1" -I http://localhost:8080/
```

## Deploy to EC2 (GitHub Actions + AWS SSM Parameter Store)

The workflow deploy job (`deploy_ec2`) uses **AWS Systems Manager RunCommand** (no SSH keys / no open SSH port required).

### 1) Ensure EC2 is managed by SSM

- SSM Agent is **online**
- Instance has IAM role/policy: `AmazonSSMManagedInstanceCore`

### 2) Set GitHub Variables (not Secrets)

In your GitHub repo settings, add **Variables**:

- `AWS_REGION` (e.g. `ap-southeast-1`)
- `AWS_ROLE_TO_ASSUME` (IAM role ARN used by GitHub OIDC)
- `EC2_INSTANCE_ID` (e.g. `i-07a5883d82c5cfed8`)

Notes:

- You still need Docker Hub credentials as GitHub **Secrets** if your image is private (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`).
- Your EC2 must have Docker installed and allow inbound `8080/tcp` (or adjust `APP_PORT` in `.github/workflows/cicd.yml`).

## Monitoring on the same EC2 (basic)

When `deploy_ec2` runs, it also starts a minimal monitoring stack on the **same EC2**:

- **Prometheus**: `http://<EC2_PUBLIC_IP>:9090`
- **Grafana**: `http://<EC2_PUBLIC_IP>:3000` (user/pass: `admin` / `admin`)
- **node_exporter**: `http://<EC2_PUBLIC_IP>:9100` (metrics)
- **cAdvisor**: `http://<EC2_PUBLIC_IP>:8089` (metrics/UI)

Security Group: open inbound TCP for `3000`, `9090`, `9100`, `8089` (or restrict to your IP).

## Stop

```bash
docker compose down
```
