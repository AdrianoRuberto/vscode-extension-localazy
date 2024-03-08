import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const localazyConnect = vscode.commands.registerCommand('localazy.connect', async () => {
		const accessToken = await vscode.window.showInputBox({ title: "Access Token", prompt: "You can find your access token at https://localazy.com/console/tokens", ignoreFocusOut: true });

		if (accessToken) {
			try {
				const res = await fetch(`https://api.localazy.com/projects`, { headers: { Authorization: `Bearer ${accessToken}` } })
					.then(r => r.json() as Promise<Record<string, any>[]>);
				if (res.length === 1) {
					context.workspaceState.update("localazy.access_token", accessToken);
					context.workspaceState.update("localazy.projectId", res[0].id);
					vscode.window.showInformationMessage("Working on project: " + res[0].slug);
				} else {
					// TODO
					vscode.window.showWarningMessage("[not implement] Multiple projects found");
				}
			} catch (err) {
				vscode.window.showErrorMessage(JSON.stringify(err, Object.getOwnPropertyNames(err)));
			}
		}
	});

	const localazyAddKey = vscode.commands.registerCommand("localazy.addKey", async () => {
		const languages = vscode.workspace.getConfiguration("localazy").get("languages");
		if (!Array.isArray(languages)) {
			throw new Error("localazy.languages setting should be an array");
		}

		const accessToken = context.workspaceState.get("localazy.access_token");
		if (!accessToken) {
			vscode.window.showErrorMessage("No access token found, use 'Localazy connect' to add one");
			return;
		}

		const keyId = await (() => {
			const editor = vscode.window.activeTextEditor;
			const selection = editor?.selection;
			if (!selection || selection.isEmpty) {
				return vscode.window.showInputBox({ title: "Source key" });
			} else {
				const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
				const selectedText = editor.document.getText(selectionRange);
				return vscode.window.showInputBox({ title: "Source key", value: selectedText });
			}
		})();

		if (!keyId) {
			return;
		}

		const ns = await vscode.window.showInputBox({ title: "namespace (ie: global)", ignoreFocusOut: true });

		const content: Record<string, any> = { "type": "json" };
		for (const lang of languages) {
			const value = await vscode.window.showInputBox({ title: lang, ignoreFocusOut: true });
			content[lang] = { [keyId]: value };
		}

		const projectId = context.workspaceState.get("localazy.projectId");
		fetch(`https://api.localazy.com/projects/${projectId}/import`, {
			method: "POST",
			headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				files: [
					{
						"name": ns ? `${ns}.json` : "",
						"content": content
					}
				]
			})
		})
			.then(() => vscode.window.showInformationMessage("Successfuly added " + keyId))
			.catch(console.error);
	});

	context.subscriptions.push(localazyConnect);
	context.subscriptions.push(localazyAddKey);
}

// This method is called when your extension is deactivated
export function deactivate() { }
