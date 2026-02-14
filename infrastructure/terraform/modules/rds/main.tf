resource "aws_security_group" "rds" {
  name_prefix = "${var.identifier}-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  tags = {
    Name = "${var.identifier}-sg"
  }
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.1.1"

  identifier = var.identifier

  engine               = "postgres"
  engine_version       = "16"
  family               = "postgres16"
  major_engine_version = "16"
  instance_class       = "db.t4g.micro" # Free tier eligible-ish, low cost

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 5432

  multi_az               = false # Cost saving
  db_subnet_group_name   = "${var.identifier}-subnet-group"
  subnet_ids             = var.subnet_ids
  vpc_security_group_ids = [aws_security_group.rds.id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  backup_retention_period = 7
  skip_final_snapshot     = true # For demo purposes
  deletion_protection     = false # For demo purposes
}
