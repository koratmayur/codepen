(window as any).MonacoEnvironment = {
  getWorkerUrl: (_moduleId: any, label: string) => {
    switch (label) {
      case 'typescript':
      case 'javascript':
        return '/assets/vs/language/typescript/ts.worker.js';
      default:
        return '/assets/vs/editor/editor.worker.js';
    }
  },
};

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
