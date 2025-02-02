variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "ami_id" {
  description = "AMI ID for Ubuntu"
  default     = "ami-04b4f1a9cf54c11d0"  # Ubuntu 24.04 AMI
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.medium"
}

variable "key_name" {
  description = "EC2 Key Pair name"
  default     = "ibs-care-key"
}

variable "github_username" {
  description = "Your GitHub username"
  type        = string
}

variable "ghcr_pat" {
  description = "GitHub Container Registry Personal Access Token"
  type        = string
  sensitive   = true
  default     = ""  # Leave default empty
}
