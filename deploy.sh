#!/bin/bash
aws ssm put-parameter --name "docker_user" --value "$USER_CREDENTIALS_USR" --type "String" --overwrite
aws ssm put-parameter --name "backend_image_version" --value "$BACKEND_IMG_VERSION" --type "String" --overwrite
aws ssm put-parameter --name "tweaxy_registry_cred" --value "$USER_CREDENTIALS_PSW" --type "SecureString" --overwrite
ssh -i /opt/backend $backend_dev_user@$backend_dev_server "mkdir -p /home/ec2-user/backend"
scp -i /opt/backend  docker-compose.yml $backend_dev_user@$backend_dev_server:/home/ec2-user/backend/docker-compose.yml
scp -i /opt/backend  backend.sh $backend_dev_user@$backend_dev_server:/home/ec2-user/backend/backend.sh
ssh -i /opt/backend $backend_dev_user@$backend_dev_server "cd /home/ec2-user/backend && ./backend.sh"
