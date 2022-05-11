#!/bin/sh
cd ~/WithChat-Server/with-chat-server <<EOF
    git pull origin master
    pm2 restart npm
    exit
EOF