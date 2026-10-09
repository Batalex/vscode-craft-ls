# craft-ls VSCode extension

VSCode extension for [`craft-ls`](https://github.com/batalex/craft-ls), a
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
implementation for *craft tools (`snapcraft`, `rockcraft`, `charmcraft`).


**Please note that this extension was created using LLMs**.

## Features

| Feature                | Snapcraft | Rockcraft | Charmcraft |
| :--------------------- | :-------: | :-------: | :--------: |
| Diagnostics            |    ✅     |    ✅     |     ✅     |
| Documentation on hover |    ✅     |    ✅     |     ✅     |
| Symbols                |    ✅     |    ✅     |     ✅     |
| Autocompletion         |    ✅     |    ✅     |     ✅     |

## Installation

Install the extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=abatisse.craft-ls).

The extension does **not** bundle the language server. It launches the `craft-ls` binary
already installed on your system:

```shell
uv tool install craft-ls
# or
pipx install craft-ls
```

(See also the [snap](https://snapcraft.io/craft-ls) and the
[nix flake](https://flakehub.com/flake/Batalex/craft-ls) packages.)

If no `craft-ls` binary is found on your `PATH`, the extension shows a warning when it starts.

## Configuration

```jsonc
{
    // Explicit path to the craft-ls executable.
    // Leave empty to resolve the binary from the PATH.
    "craft-ls.serverPath": "/home/user/.local/bin/craft-ls"
}
```

After changing the setting, run the `Craft-ls: Restart Server` command.

## Development

```shell
npm install
npm run watch        # esbuild watch mode
npm run lint         # typecheck + eslint
npm run vsce-package # build the VSIX
```

## Release

Releases are automated by `.github/workflows/release.yaml` on version tags.
