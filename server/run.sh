# Restart cloudflared
# Sometimes it's acting up
if command -v cloudflared &> /dev/null; then
    # For Mac OS users
    if [ "$(uname)" == "Darwin" ]; then
        echo "Restarting cloudflared..."

        sudo launchctl stop com.cloudflare.cloudflared
        sudo launchctl unload /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
        sudo launchctl load /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
        sudo launchctl start com.cloudflare.cloudflared
    fi
fi

cargo watch -w "./src" -w "./run.sh" -x "run -r"
# cargo watch -w "./src" -w "./run.sh" -w "../datasets/disk_path_to_type.json" -x "run -r"
