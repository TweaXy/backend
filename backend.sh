#!/bin/bash
aws configure set region eu-north-1
export BUILD_ID=$(aws ssm get-parameter --name "backend_image_version" --with-decryption --query Parameter.Value | tr -d '"') #--output text
export DOCKER_USER=$(aws ssm get-parameter --name "docker_user" --with-decryption --query Parameter.Value | tr -d '"')  #--output text
echo $BUILD_ID
echo $DOCKER_USER
docker-compose down
docker image ls | grep -w -E 'none|$DOCKER_USER/backend' | awk '{print $3}' | xargs -r docker image rm -f
docker-compose pull
docker-compose up backend -d 
