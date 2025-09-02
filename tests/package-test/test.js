const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const nodeFs = require('node:fs/promises');
const nodePath = require('node:path');
const { TEMP_DIR } = require('./setup');

const PATH_PUBLIC_VSCODE = nodePath.join(
  TEMP_DIR,
  'node_modules/@gitlab/web-ide/dist/public/vscode',
);
const PATH_PUBLIC_VSCODE_NODE_MODULES = nodePath.join(PATH_PUBLIC_VSCODE, 'node_modules');
const PATH_EXTENSION_HOST_HTML = nodePath.join(
  PATH_PUBLIC_VSCODE,
  'out/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.esm.html',
);

describe('@gitlab/web-ide package', () => {
  test('does not have extraneous html files', async () => {
    const allChildren = await nodeFs.readdir(PATH_PUBLIC_VSCODE, {
      encoding: 'utf-8',
      recursive: true,
    });
    const htmlChildren = allChildren.filter(x => x.endsWith('.html'));

    assert.deepStrictEqual(htmlChildren, [
      // This is the only HTML file we expect and it's protected by the other test.
      'out/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.esm.html',

      // HTML files from "extensions" should be safe (since they only work in an extension host environment really).
      // We're going to list them out here though to err on the side of caution.
      'extensions/microsoft-authentication/media/index.html',
      'extensions/gitlab-vscode-extension/webviews/security_finding/index.html',
      'extensions/gitlab-vscode-extension/webviews/gitlab_duo_chat/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/theming-preview/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/security-vuln-details/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/duo-workflow-panel/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/duo-workflow/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/duo-chat-v2/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/duo-chat/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/agentic-tabs/index.html',
      'extensions/gitlab-vscode-extension/assets/language-server/webviews/agentic-duo-chat/index.html',
      'extensions/github-authentication/media/index.html',
    ]);
  });

  test('contains vscode/node_modules', async () => {
    // Yarn was doing weird stuff when trying to include a directory called 'node_modules'
    // We think we've worked around this, but let's add a test just in case.
    // https://gitlab.com/gitlab-org/gitlab-web-ide/-/merge_requests/400
    const stat = await nodeFs.stat(PATH_PUBLIC_VSCODE_NODE_MODULES);

    assert.strictEqual(stat.isDirectory(), true);
  });

  test('prevents xss by patching parentOrigin in webIdeExtensionHost.html', async () => {
    const content = await nodeFs.readFile(PATH_EXTENSION_HOST_HTML, { encoding: 'utf-8' });

    // https://gitlab.com/gitlab-org/security/gitlab-web-ide-vscode-fork/-/issues/1#note_1905417620
    assert.match(content, /const parentOrigin = window\.origin;/);
  });
});
