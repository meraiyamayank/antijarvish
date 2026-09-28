variable "aws_region" {
  description = "AWS region for resources."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)."
  type        = string
  default     = "prod"
}

variable "app_name" {
  description = "Application identifier."
  type        = string
  default     = "jarvis-saas"
}

variable "vpc_cidr" {
  description = "CIDR block for the primary VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "jarvis_db"
}

variable "db_username" {
  description = "PostgreSQL master username."
  type        = string
  default     = "jarvis_admin"
}

variable "db_password" {
  description = "PostgreSQL master password."
  type        = string
  sensitive   = true
  default     = "ChangeMeToSecurePassword123!"
}

variable "backend_image" {
  description = "ECR image URI for the Django REST API."
  type        = string
  default     = "123456789012.dkr.ecr.us-east-1.amazonaws.com/jarvis-backend:latest"
}

variable "frontend_image" {
  description = "ECR image URI for the Next.js frontend."
  type        = string
  default     = "123456789012.dkr.ecr.us-east-1.amazonaws.com/jarvis-frontend:latest"
}
