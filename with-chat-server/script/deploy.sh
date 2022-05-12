ssh withchat01@db.withchat.site <<EOF
    cd ~/ovni		
    git pull origin master
    pm2 restart npm
    exit
EOF