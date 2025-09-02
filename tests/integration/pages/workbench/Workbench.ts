import type { FrameLocator, Locator, Page } from '@playwright/test';
import { FilesExplorer } from './components/FilesExplorer';
import { TextEditor } from './components/TextEditor';
import { SourceControl } from './components/SourceControl';

export const WEB_IDE_FRAME_TEST_ID = 'web-ide-iframe';

interface WebIDEConstructionOptions {
  page: Page;
}

export class Workbench {
  readonly #page: Page;

  readonly webIdeFrame: FrameLocator;

  readonly filesExplorer: FilesExplorer;

  readonly textEditor: TextEditor;

  readonly sourceControl: SourceControl;

  constructor({ page }: WebIDEConstructionOptions) {
    this.#page = page;
    this.webIdeFrame = this.#page.getByTestId(WEB_IDE_FRAME_TEST_ID).contentFrame();
    this.filesExplorer = new FilesExplorer(this.webIdeFrame);
    this.textEditor = new TextEditor(this.webIdeFrame);
    this.sourceControl = new SourceControl(this.webIdeFrame);
  }

  async clickTab(tabName: string) {
    await this.webIdeFrame.getByRole('tab', { name: tabName }).click();
  }

  getMenu(): Locator {
    return this.webIdeFrame.getByRole('menu');
  }
}
