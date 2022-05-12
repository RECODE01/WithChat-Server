ssh withchat01@db.withchat.site <<EOF
    cd WithChat-Server/with-chat-server	
    git pull origin master
    npm install
    pm2 restart npm
    exit
EOF
# test