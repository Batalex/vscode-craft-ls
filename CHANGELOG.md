# Change Log

## 2026.10.0

The versioning scheme is now calendar-based.

- The language server is no longer bundled with the extension.
  Install `craft-ls` separately (`uv tool install craft-ls`, `pipx install craft-ls`,
  snap, or nix flake).
- Following the previous item, the `craft-ls.interpreter` setting is removed. The extension no longer
  manages a Python interpreter. It directly launches the `craft-ls` binary.
- New setting `craft-ls.serverPath` to point to an explicit `craft-ls` executable
  (empty by default: resolved from `PATH`).
- Dropped the `ms-python.python` extension dependency.
- Requires VS Code 1.90+.
