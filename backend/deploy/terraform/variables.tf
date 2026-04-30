variable "aws_region" {
  type        = string
  description = "AWS region."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Resource prefix (ECR repo name, Lambda name, etc.)."
  default     = "meridian-backend"
}

variable "lambda_image_tag" {
  type        = string
  description = "Container image tag already pushed to ECR (e.g. latest)."
  default     = "latest"
}

variable "lambda_timeout" {
  type        = number
  description = "Lambda timeout in seconds (max 900). API Gateway HTTP API still caps client wait ~30s."
  default     = 29
}

variable "lambda_memory_mb" {
  type        = number
  description = "Lambda memory in MB."
  default     = 1024
}

variable "lambda_architectures" {
  type        = list(string)
  description = "Lambda CPU architecture. Match Docker build platform (e.g. x86_64 -> linux/amd64)."
  default     = ["x86_64"]
}

variable "lambda_environment" {
  type        = map(string)
  description = "Plain env vars for the function. Prefer AWS Secrets Manager / SSM for secrets in production."
  default     = {}
  sensitive   = true
}

variable "api_cors_origins" {
  type    = list(string)
  default = ["*"]
}

variable "api_cors_methods" {
  type    = list(string)
  default = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}

variable "api_cors_headers" {
  type    = list(string)
  default = ["*"]
}
