#!/bin/bash
aws ssm put-parameter --name "docker_user" --value "$USER_CREDENTIALS_USR" --type "String" --overwrite
aws ssm put-parameter --name "chat_image_version" --value "$CHAT_IMG_VERSION" --type "String" --overwrite
aws ssm put-parameter --name "tweaxy_registry_cred" --value "$USER_CREDENTIALS_PSW" --type "SecureString" --overwrite
ssh -i /opt/chat $chat_dev_user@$chat_dev_server "mkdir -p /home/omarsaid/chat"
scp -i /opt/chat  docker-compose.yml $chat_dev_user@$chat_dev_server:/home/omarsaid/chat/docker-compose.yml
scp -i /opt/chat  chat.sh $chat_dev_user@$chat_dev_server:/home/omarsaid/chat/chat.sh
ssh -i /opt/chat $chat_dev_user@$chat_dev_server "cd /home/omarsaid/chat && chmod +x chat.sh && ./chat.sh"
