output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "db_endpoint" {
  description = "The connection endpoint for the database"
  value       = module.rds.db_instance_endpoint
}

output "redis_endpoint" {
  description = "Endpoint of the Redis cluster"
  value       = module.redis.redis_endpoint
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for documents"
  value       = module.s3_documents.s3_bucket_id
}
