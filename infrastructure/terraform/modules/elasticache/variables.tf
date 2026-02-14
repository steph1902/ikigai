variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "identifier" {
  description = "Identifier for the Redis cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the redis cluster will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the redis subnet group"
  type        = list(string)
}

variable "eks_security_group_id" {
  description = "Security group ID of EKS cluster to allow access"
  type        = string
}
