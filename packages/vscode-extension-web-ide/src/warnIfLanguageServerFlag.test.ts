import * as vscode from 'vscode';
import { createFakePartial } from '@gitlab/utils-test';
import { warnIfLanguageServerFlag } from './warnIfLanguageServerFlag';

const NOOP_CONFIG = createFakePartial<vscode.WorkspaceConfiguration>({});

// NOTE: showWarningMessage is actually a union type and works strangely
// when paired with jest.mocked... Let's be explicit about the stringiness
// of our targeted implementation.
type showStringWarningMessage = (message: string, items?: string[]) => Thenable<string | undefined>;

describe('warnIfLanguageServerFlag', () => {
  let flagValue: boolean;
  let resolveMessage: (message?: string) => void;
  let gitlabConfig: vscode.WorkspaceConfiguration;
  let waitForSubject: Promise<void>;

  beforeEach(() => {
    flagValue = false;

    gitlabConfig = createFakePartial<vscode.WorkspaceConfiguration>({
      get: jest.fn().mockImplementation(key => {
        if (key === 'featureFlags.languageServerWebIDE') {
          return flagValue;
        }

        return undefined;
      }),
    });

    jest
      .mocked(vscode.workspace.getConfiguration)
      .mockImplementation(key => (key === 'gitlab' ? gitlabConfig : NOOP_CONFIG));

    jest.mocked<showStringWarningMessage>(vscode.window.showWarningMessage).mockImplementation(
      () =>
        new Promise(resolve => {
          resolveMessage = resolve;
        }),
    );
  });

  describe('default', () => {
    beforeEach(async () => {
      await warnIfLanguageServerFlag();
    });

    it('does nothing', () => {
      expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
      expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
    });
  });

  describe('when language server flag is enabled', () => {
    beforeEach(() => {
      flagValue = true;
      waitForSubject = warnIfLanguageServerFlag();
    });

    it('prompts for warning message', () => {
      expect(vscode.window.showWarningMessage).toHaveBeenCalledTimes(1);
      expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
        expect.stringContaining('Experimental feature detected.'),
        'Open Settings',
        'Cancel',
      );
    });

    it('when open settings is clicked, it opens the settings menu', async () => {
      resolveMessage('Open Settings');
      await waitForSubject;

      expect(vscode.commands.executeCommand).toHaveBeenCalledTimes(1);
      expect(vscode.commands.executeCommand).toHaveBeenCalledWith(
        'workbench.action.openSettings',
        'gitlab.featureFlags.languageServerWebIDE',
      );
    });

    it.each(['Cancel', undefined])('when %s is clicked, does nothing', async action => {
      resolveMessage(action);
      await waitForSubject;

      expect(vscode.commands.executeCommand).toHaveBeenCalledTimes(0);
    });
  });
});
