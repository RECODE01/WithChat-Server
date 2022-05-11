#!/bin/sh
cd /home/withchat01/WithChat-Server/with-chat-server <<EOF
    dirname=${PWD##*/}
    echo $dirname
    git pull origin master
    pm2 restart npm
    exit
EOF