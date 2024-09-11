# Guidelines

## Parser

- Avoid floats as much as possible
  - Use structs like `WAmount` and `Price` for calculations
  - **Only** use `WAmount.to_btc()` when inserting or computing inside a dataset. It is **very** expensive.
- No `Arc`, `Rc`, `Mutex` even from third party libraries, they're slower
