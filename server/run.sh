if cargo watch --help &> /dev/null; then
    cargo watch --no-vcs-ignores -w "./src" -w "./run.sh" -w "./in/datasets_len.txt" -x "run -r"
else
    cargo run -r
fi
