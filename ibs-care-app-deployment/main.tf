provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "ibs_care_app" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.ibs_care_sg.id]

user_data = <<-EOF
            #!/bin/bash
            sudo apt update -y
            sudo apt install -y docker.io
            sudo systemctl start docker
            sudo docker login ghcr.io -u ${var.github_username} -p ${var.ghcr_pat}
            sudo docker pull ghcr.io/limogiai/ibs-care-app:latest

            # Stop and remove the old container (if running)
            sudo docker stop ibs-care-app || true
            sudo docker rm ibs-care-app || true

            # Run the latest container
            sudo docker run -d --name ibs-care-app -p 4434:80 ghcr.io/limogiai/ibs-care-app:latest
            EOF

  tags = {
    Name = "IBS-Care-App"
  }
}

resource "aws_security_group" "ibs_care_sg" {
  name        = "ibs-care-sg"
  description = "Allow HTTP and SSH traffic"

  ingress {
    from_port   = 4434
    to_port     = 4434
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
