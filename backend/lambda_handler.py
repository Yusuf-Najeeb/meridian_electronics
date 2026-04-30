# AWS Lambda / Mangum entry (see Dockerfile.lambda and deploy/terraform/).
# Local dev continues to use: uv run uvicorn main:app
from mangum import Mangum

from main import app

handler = Mangum(app, lifespan="auto")
