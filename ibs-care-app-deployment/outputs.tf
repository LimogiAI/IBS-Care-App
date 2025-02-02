output "public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.ibs_care_app.public_ip
}

output "app_url" {
  description = "Application URL"
  value       = "http://${aws_instance.ibs_care_app.public_ip}:4434"
}
