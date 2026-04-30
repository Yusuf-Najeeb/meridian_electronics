output "ecr_repository_url" {
  description = "docker tag/push target for both ECS-style and Lambda images."
  value       = aws_ecr_repository.api.repository_url
}

output "ecr_repository_arn" {
  value = aws_ecr_repository.api.arn
}

output "lambda_function_arn" {
  value = aws_lambda_function.api.arn
}

output "http_api_endpoint" {
  description = "Base URL for API Gateway (append FastAPI paths, e.g. /api/v1/health/)."
  value       = aws_apigatewayv2_stage.default.invoke_url
}
