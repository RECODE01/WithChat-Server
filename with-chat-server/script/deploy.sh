#!/bin/sh
ssh withchat01@gmail.com@34.64.219.134 <<EOF
    cd ~/WithChat-Server/with-chat-server
    git pull origin master
    pm2 restart npm
    exit
EOF