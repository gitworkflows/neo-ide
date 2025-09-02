import type { gitlab, DeprecatedGitLabClient as GitLabClient } from '@gitlab/gitlab-api-client';
import type { WebIdeExtensionConfig } from '@gitlab/web-ide-types';

export const commandFactory =
  (config: WebIdeExtensionConfig, client: GitLabClient) =>
  async (payload: gitlab.CommitPayload): Promise<void> => {
    await client.commit(config.projectPath, payload);
  };
