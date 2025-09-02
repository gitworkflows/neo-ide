import type { Locator, Page } from '@playwright/test';

interface InitFormConstructionOptions {
  page: Page;

  gitlabUrl: string;

  projectPath: string;

  repositoryRef: string;

  accessToken: string;
}

export class InitForm {
  readonly #page: Page;

  readonly #gitlabUrlTextbox: Locator;

  readonly #projectPathTextbox: Locator;

  readonly #gitRefTextbox: Locator;

  readonly #authenticationTypeCombobox: Locator;

  readonly #gitlabTokenTextbox: Locator;

  readonly #startWebIdeButton: Locator;

  readonly #gitlabUrl: string;

  readonly #gitlabProject: string;

  readonly #repositoryRef: string;

  readonly #accessToken: string;

  constructor({
    page,
    gitlabUrl,
    repositoryRef,
    projectPath,
    accessToken,
  }: InitFormConstructionOptions) {
    this.#page = page;
    this.#gitlabUrl = gitlabUrl;
    this.#gitlabProject = projectPath;
    this.#repositoryRef = repositoryRef;
    this.#accessToken = accessToken;
    this.#gitlabUrlTextbox = this.#page.getByRole('textbox', { name: 'GitLab URL' });
    this.#projectPathTextbox = this.#page.getByRole('textbox', { name: 'Project Path' });
    this.#gitRefTextbox = this.#page.getByRole('textbox', { name: 'Git ref' });
    this.#authenticationTypeCombobox = this.#page.getByRole('combobox', {
      name: 'Authentication Type',
    });
    this.#gitlabTokenTextbox = this.#page.getByRole('textbox', {
      name: 'Gitlab Token',
    });
    this.#startWebIdeButton = this.#page.getByRole('button', { name: 'Start GitLab Web IDE' });
  }

  /**
   * Fills in the GitLab URL, project path, repository ref, and token
   * in the example app initialization form and start the Web IDE.
   */
  async initWebIDE(): Promise<void> {
    await this.#gitlabUrlTextbox.fill(this.#gitlabUrl);
    await this.#projectPathTextbox.fill(this.#gitlabProject);
    await this.#gitRefTextbox.fill(this.#repositoryRef);
    await this.#authenticationTypeCombobox.selectOption('Token');
    await this.#gitlabTokenTextbox.fill(this.#accessToken);

    await this.#startWebIdeButton.click();
    await this.#page.waitForLoadState('load');
  }
}
