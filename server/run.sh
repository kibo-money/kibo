if cargo watch --help &> /dev/null; then
    cargo watch -w "./src" -w "./run.sh" -w "../datasets/disk_path_to_type.json" -x "run -r"
    # cargo watch -w "./src" -w "./run.sh" -x "run -r"
else
    cargo run -r
fi
