import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { SERVER_NAME, SERVER_PATH_SETTING } from './constants';
import { startServer, stopServer } from './server';

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const outputChannel = vscode.window.createOutputChannel(SERVER_NAME, { log: true });
    context.subscriptions.push(outputChannel);

    const restart = async (reason: string): Promise<void> => {
        outputChannel.info(`Restarting server: ${reason}`);
        await stopServer(client);
        client = await startServer(outputChannel);
    };

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(SERVER_PATH_SETTING)) {
                void restart('configuration changed');
            }
        }),
        vscode.commands.registerCommand(`craft-ls.restart`, () => restart('command')),
    );

    await restart('activation');
}

export async function deactivate(): Promise<void> {
    await stopServer(client);
    client = undefined;
}