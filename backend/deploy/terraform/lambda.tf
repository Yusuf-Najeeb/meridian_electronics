# API Gateway HTTP API v2 can wait at most 30s for a Lambda (integration timeout).
# Slow LLM + MCP calls may be cut off — for long chats prefer ECS/Fargate or a different
# entry (e.g. ALB -> ECS). Short requests and health checks work well here.
#
# Prerequisite: ECR has an image tagged with var.lambda_image_tag (see README.txt in this folder).
resource "aws_lambda_function" "api" {
  function_name = var.project_name
  role          = aws_iam_role.lambda.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.api.repository_url}:${var.lambda_image_tag}"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_mb
  architectures = var.lambda_architectures

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = 14
}
