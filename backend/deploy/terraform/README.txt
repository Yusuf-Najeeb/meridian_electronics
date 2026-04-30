What this Terraform stack creates
=================================
- aws_ecr_repository (+ lifecycle policy) — store container images
- aws_lambda_function — FastAPI via Mangum (image from ECR)
- aws_iam_role — Lambda execution + basic CloudWatch Logs
- aws_apigatewayv2_api / integration / route / stage — HTTP API → Lambda ($default catch-all)
- aws_cloudwatch_log_group — /aws/lambda/<project_name>

Important limits
================
- API Gateway HTTP API waits up to ~30s for Lambda. Long agent/MCP calls may time out at the gateway even if Lambda timeout is higher. Use ECS/Fargate + ALB for long streams, or async patterns.

Apply order
===========
1) terraform init && terraform apply   # creates ECR (and will fail creating Lambda if image missing — see below)

If Lambda fails on first apply because the image does not exist yet:
  a) terraform apply -target=aws_ecr_repository.api -target=aws_ecr_lifecycle_policy.api
  b) Authenticate Docker to ECR, build & push:
       aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
       cd <path-to>/backend
       docker build --platform linux/amd64 -f Dockerfile.lambda -t <project>:lambda .
       docker tag <project>:lambda <ecr_url>:latest
       docker push <ecr_url>:latest
  c) terraform apply

Lambda env vars (example tfvars)
================================
Pass non-secret config via lambda_environment; inject secrets via Secrets Manager in real deployments.

  lambda_environment = {
    OPENROUTER_API_KEY = "..."
    ENVIRONMENT        = "production"
    BASE_URL           = "https://openrouter.ai/api/v1"
    DATABASE_URL       = "sqlite:////tmp/app.db"
  }

SQLite on Lambda is ephemeral; use RDS + postgresql+psycopg://... for persistence.

Local Docker (not Lambda) still uses: backend/Dockerfile + uvicorn.

Troubleshooting: Lambda "image manifest ... media type ... is not supported"
============================================================================
Docker BuildKit embeds provenance/SBOM in the manifest; Lambda rejects that. Rebuild with attestations off.

From repo root, substitute your region if needed:

  cd backend/deploy/terraform
  export ECR_URL=$(terraform output -raw ecr_repository_url)
  REGISTRY="${ECR_URL%%/*}"
  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$REGISTRY"

  cd ../..                                    # now in backend/
  docker buildx build --platform linux/amd64 -f Dockerfile.lambda \
    --provenance=false --sbom=false \
    -t "${ECR_URL}:latest" --push .

Alternatively: export BUILDX_NO_DEFAULT_ATTESTATIONS=1 before docker buildx build.

If apply stopped halfway (API exists but Lambda failed), run terraform apply again after a successful push.
