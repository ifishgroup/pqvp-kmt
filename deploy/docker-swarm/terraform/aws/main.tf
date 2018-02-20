terraform {
  required_version = "~> 0.11.0"
  backend "s3" {}
}

provider "aws" {
  region = "${var.region}"
}

resource "aws_instance" "docker_swarm_manager_init" {
  instance_type               = "${var.instance_type}"
  ami                         = "${data.aws_ami.pqvp_kmt_ami.id}"
  key_name                    = "${var.private_key_name}"
  vpc_security_group_ids      = ["${aws_security_group.docker_swarm_sg.id}", "${aws_security_group.docker_swarm_managers_sg.id}"]
  associate_public_ip_address = "true"

  tags {
    Name        = "pqvp-kmt-leader-${var.environment}-${var.git_commit}"
    Environment = "${var.environment}"
    GitCommit   = "${var.git_commit}"
    GitBranch   = "${var.git_branch}"
    Build       = "${var.git_branch}"
  }

  connection {
    user        = "ubuntu"
    private_key = "${file("${var.private_key_path}")}"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo service docker start",
      "docker swarm init",
    ]
  }

  provisioner "local-exec" {
    command = "TOKEN=$(ssh -i ${var.private_key_path} -o StrictHostKeyChecking=no ubuntu@${aws_instance.docker_swarm_manager_init.public_ip} docker swarm join-token -q worker); echo \"#!/usr/bin/env bash\ndocker swarm join --token $TOKEN ${aws_instance.docker_swarm_manager_init.public_ip}:2377\" >| join_worker.sh"
  }

  provisioner "local-exec" {
    command = "TOKEN=$(ssh -i ${var.private_key_path} -o StrictHostKeyChecking=no ubuntu@${aws_instance.docker_swarm_manager_init.public_ip} docker swarm join-token -q manager); echo \"#!/usr/bin/env bash\ndocker swarm join --token $TOKEN ${aws_instance.docker_swarm_manager_init.public_ip}:2377\" >| join_manager.sh"
  }
}

resource "aws_instance" "docker_swarm_managers" {
  depends_on                  = ["aws_instance.docker_swarm_manager_init"]
  count                       = "${var.additional_manager_nodes}"
  instance_type               = "${var.instance_type}"
  ami                         = "${data.aws_ami.pqvp_kmt_ami.id}"
  key_name                    = "${var.private_key_name}"
  vpc_security_group_ids      = ["${aws_security_group.docker_swarm_sg.id}", "${aws_security_group.docker_swarm_managers_sg.id}"]
  associate_public_ip_address = "true"

  tags {
    Name        = "pqvp-kmt-manager-${var.environment}-${var.git_commit}"
    Environment = "${var.environment}"
    GitCommit   = "${var.git_commit}"
    GitBranch   = "${var.git_branch}"
    Build       = "${var.git_branch}"
  }

  connection {
    user        = "ubuntu"
    private_key = "${file("${var.private_key_path}")}"
  }

  provisioner "file" {
    source      = "join_manager.sh"
    destination = "/tmp/join_manager.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo service docker start",
      "chmod +x /tmp/join_manager.sh",
      "/tmp/join_manager.sh",
    ]
  }
}

resource "aws_instance" "docker_swarm_workers" {
  depends_on                  = ["aws_instance.docker_swarm_manager_init"]
  count                       = "${var.num_nodes}"
  instance_type               = "${var.instance_type}"
  ami                         = "${data.aws_ami.pqvp_kmt_ami.id}"
  key_name                    = "${var.private_key_name}"
  vpc_security_group_ids      = ["${aws_security_group.docker_swarm_sg.id}"]
  associate_public_ip_address = "false"

  tags {
    Name        = "pqvp-kmt-worker-${var.environment}-${var.git_commit}"
    Environment = "${var.environment}"
    GitCommit   = "${var.git_commit}"
    GitBranch   = "${var.git_branch}"
    Build       = "${var.git_branch}"
  }

  connection {
    user         = "ubuntu"
    private_key  = "${file("${var.private_key_path}")}"
    bastion_host = "${aws_instance.docker_swarm_manager_init.public_ip}"
  }

  provisioner "file" {
    source      = "join_worker.sh"
    destination = "/tmp/join_worker.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo service docker start",
      "chmod +x /tmp/join_worker.sh",
      "/tmp/join_worker.sh",
    ]
  }
}

resource "null_resource" "create_docker_networks" {
  depends_on = ["aws_instance.docker_swarm_manager_init"]

  connection {
    user        = "ubuntu"
    private_key = "${file("${var.private_key_path}")}"
    host        = "${aws_instance.docker_swarm_manager_init.public_ip}"
  }

  provisioner "remote-exec" {
    inline = [
      "docker network create --driver overlay monitoring",
    ]
  }
}

resource "null_resource" "deploy_docker_stack" {
  depends_on = [ "aws_instance.docker_swarm_workers", "null_resource.create_docker_networks" ]

  connection {
    user = "ubuntu"
    private_key = "${file("${var.private_key_path}")}"
    host = "${aws_instance.docker_swarm_manager_init.public_ip}"
  }

  provisioner "file" {
    source = "docker-compose.yml"
    destination = "docker-compose.yml"
  }

  provisioner "remote-exec" {
    inline = [
      "export TAG=${var.tag}",
      "docker-compose -f docker-compose.yml pull",
      "docker stack deploy -c docker-compose.yml pqvp-kmt"
    ]
  }
}

resource "null_resource" "launch_weave_scope" {
  depends_on = ["aws_instance.docker_swarm_manager_init"]

  connection {
    user        = "ubuntu"
    private_key = "${file("${var.private_key_path}")}"
    host        = "${aws_instance.docker_swarm_manager_init.public_ip}"
  }

  provisioner "remote-exec" {
    inline = [
      "scope launch",
    ]
  }
}

resource "null_resource" "cleanup" {
  depends_on = ["aws_instance.docker_swarm_workers", "aws_instance.docker_swarm_managers"]

  provisioner "local-exec" {
    command = "rm -f -- join_worker.sh"
  }

  provisioner "local-exec" {
    command = "rm -f -- join_manager.sh"
  }
}
