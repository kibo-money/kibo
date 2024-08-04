if cargo watch --help &> /dev/null; then
    TRIGGER="./in/datasets_len.txt"
    echo "0" > $TRIGGER
    cargo watch --no-vcs-ignores -w "./src" -w "./run.sh" -w "$TRIGGER" -x "run -r"
else
    cargo run -r
fi
