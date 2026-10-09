import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    RevealOutputChannelOn,
    ServerOptions,
} from 'vscode-languageclient/node';
import { INSTALL_DOCS_URL, SERVER_BINARY, SERVER_ID, SERVER_NAME, SERVER_PATH_SETTING } from './constants';

function getServerPathSetting(): string {
    return vscode.workspace.getConfiguration('craft-ls').get<string>(SERVER_PATH_SETTING) ?? '';
}

/** Check that a binary exists and is executable, following symlinks. */
function isExecutable(candidate: string): boolean {
    try {
        fs.accessSync(candidate, fs.constants.X_OK);
        return fs.statSync(candidate).isFile();
    } catch {
        return false;
    }
}

/** Look up the binary name on the PATH (POSIX only; Windows is not supported). */
function findOnPath(binary: string): string | undefined {
    for (const dir of process.env.PATH?.split(path.delimiter) ?? []) {
        if (!dir) {
            continue;
        }
        const candidate = path.join(dir, binary);
        if (isExecutable(candidate)) {
            return candidate;
        }
    }
    return undefined;
}

/** Resolve the server executable from the setting or the PATH. */
function resolveServer(): string | undefined {
    const setting = getServerPathSetting().trim();
    if (setting) {
        if (isExecutable(setting)) {
            return setting;
        }
        // Allow plain binary names in the setting too.
        return findOnPath(setting);
    }
    return findOnPath(SERVER_BINARY);
}

function warnServerNotFound(): void {
    void vscode.window
        .showWarningMessage(
            `Could not find the ${SERVER_BINARY} executable on your PATH. Install it first, e.g. "uv tool install craft-ls" or "pipx install craft-ls", or set "craft-ls.serverPath".`,
            'Installation docs',
            'Open Settings',
        )
        .then((choice) => {
            if (choice === 'Installation docs') {
                void vscode.env.openExternal(vscode.Uri.parse(INSTALL_DOCS_URL));
            } else if (choice === 'Open Settings') {
                void vscode.commands.executeCommand(
                    'workbench.action.openSettings',
                    `@id:${SERVER_PATH_SETTING}`,
                );
            }
        });
}

export async function startServer(outputChannel: vscode.LogOutputChannel): Promise<LanguageClient | undefined> {
    const command = resolveServer();
    if (!command) {
        outputChannel.error(`Server executable not found: ${SERVER_BINARY}`);
        warnServerNotFound();
        return undefined;
    }
    outputChannel.info(`Starting server: ${command}`);

    const serverOptions: ServerOptions = { command, args: [] };
    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'yaml' },
            { scheme: 'untitled', language: 'yaml' },
        ],
        outputChannel,
        traceOutputChannel: outputChannel,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
    };
    const client = new LanguageClient(SERVER_ID, SERVER_NAME, serverOptions, clientOptions);
    try {
        await client.start();
        return client;
    } catch (ex) {
        outputChannel.error(`Server start failed: ${ex}`);
        await client.stop();
        return undefined;
    }
}

export async function stopServer(client: LanguageClient | undefined): Promise<void> {
    if (client) {
        try {
            await client.stop();
        } catch (ex) {
            // The server may have already exited; nothing else to do.
            void ex;
        }
    }
}
