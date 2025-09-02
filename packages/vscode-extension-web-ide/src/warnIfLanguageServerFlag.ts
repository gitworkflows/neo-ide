import * as vscode from 'vscode';

const ACTION_OPEN_SETTINGS = 'Open Settings';
const ACTION_CANCEL = 'Cancel';

export async function warnIfLanguageServerFlag(): Promise<void> {
  const config = vscode.workspace.getConfiguration('gitlab');
  const languageServerEnabled = config.get<boolean>('featureFlags.languageServerWebIDE', false);

  if (languageServerEnabled) {
    const actions = [ACTION_OPEN_SETTINGS, ACTION_CANCEL];

    const selectedAction = await vscode.window.showWarningMessage(
      'Experimental feature detected. Some features may not work as expected. Consider disabling the "gitlab.featureFlags.languageServerWebIDE" in your vscode settings.',
      ...actions,
    );

    if (selectedAction === ACTION_OPEN_SETTINGS) {
      await vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'gitlab.featureFlags.languageServerWebIDE',
      );
    }
  }
}
