import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

function resolveBinary(configuredPath: string): string | undefined {
    // If an absolute path is configured, check it directly.
    if (path.isAbsolute(configuredPath)) {
        return fs.existsSync(configuredPath) ? configuredPath : undefined;
    }

    // Otherwise search PATH entries.
    const envPath = process.env.PATH ?? '';
    for (const dir of envPath.split(path.delimiter)) {
        const candidate = path.join(dir, configuredPath);
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return undefined;
}

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('craft-ls');
    const configuredPath = config.get<string>('path', 'craft-ls');
    const binaryPath = resolveBinary(configuredPath);

    if (!binaryPath) {
        vscode.window
            .showErrorMessage(
                `craft-ls binary not found ("${configuredPath}"). Please install craft-ls or set craft-ls.path to the correct location.`,
                'Open Settings'
            )
            .then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'craft-ls.path');
                }
            });
        return;
    }

    const serverOptions: ServerOptions = {
        command: binaryPath,
        args: [],
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { language: 'yaml', pattern: '**/{snapcraft,rockcraft,charmcraft}.yaml' },
            { language: 'yaml', pattern: '**/{metadata,config,actions}.yaml' },
        ],
    };

    client = new LanguageClient('craft-ls', 'Craft Language Server', serverOptions, clientOptions);
    client.start();
    context.subscriptions.push(client);
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
