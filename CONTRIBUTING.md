# Contributing

Thanks for your interest in contributing to the `craft-ls` VSCode extension!

## Requirements

- Node.js 24 and npm (or use the provided Nix flake: `nix develop` / direnv)

## Getting started

```shell
npm install
npm run compile   # build dist/extension.js
npm run watch     # incremental build while developing
npm run lint      # type-check + eslint
```

Open the project in VS Code and launch the **Debug Extension** configuration to run the extension in a fresh window. You will need the `craft-ls` binary available on your `PATH` (e.g. `uv tool install craft-ls`) for the server to start.

## Project layout

- `src/extension.ts` — activation, commands, configuration listeners
- `src/server.ts` — server executable resolution (`craft-ls.serverPath` setting or `PATH`) and `LanguageClient` creation
- `src/constants.ts` — ids and setting names

The language server itself lives at [github.com/batalex/craft-ls](https://github.com/batalex/craft-ls); it is **not** bundled in this repository.

## Packaging and publishing

```shell
npm run vsce-package
```

Releases are published by the `Release` workflow when a `v*` tag is pushed. Update `CHANGELOG.md` and the `version` in `package.json` before tagging.