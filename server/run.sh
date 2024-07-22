if cargo watch --help &> /dev/null; then
    cargo watch --no-vcs-ignores -w "./src" -w "./run.sh" -w ".trigger" -x "run -r"
else
    cargo run -r
fi
