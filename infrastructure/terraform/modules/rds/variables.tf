variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "identifier" {
  description = "Identifier for the RDS instance"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the database will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the DB subnet group"
  type        = list(string)
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Username for the master DB user"
  type        = string
}

variable "db_password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
}

variable "eks_security_group_id" {
  description = "Security group ID of EKS cluster to allow access"
  type        = string
}
