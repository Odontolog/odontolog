#!/bin/sh
set -e
terraform init
terraform apply -var-file="dev.tfvars" -auto-approve
