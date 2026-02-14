module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
  vpc_cidr    = "10.0.0.0/16"
  cluster_name = "ikigai-${var.environment}"
}

module "eks" {
  source      = "./modules/eks"
  environment = var.environment
  cluster_name = "ikigai-${var.environment}"
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnets
}

module "rds" {
  source                = "./modules/rds"
  environment           = var.environment
  identifier            = "ikigai-db-${var.environment}"
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnets
  eks_security_group_id = module.eks.cluster_security_group_id
  db_name               = "ikigai"
  db_username           = "postgres"
  db_password           = var.db_password
}

module "redis" {
  source                = "./modules/elasticache"
  environment           = var.environment
  identifier            = "ikigai-redis-${var.environment}"
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.private_subnets
  eks_security_group_id = module.eks.cluster_security_group_id
}

module "s3_documents" {
  source      = "./modules/s3"
  environment = var.environment
  bucket_name = "ikigai-documents-${var.environment}-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}
