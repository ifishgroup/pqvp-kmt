data "aws_availability_zones" "available" {}

data "aws_ami" "pqvp_kmt_ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["pqvp-kmt"]
  }
}
