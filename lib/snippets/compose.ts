import { ActionKind } from '../types';
import { helixSnippet } from './helix';
import { templateDuplicateSnippet } from './templateDuplicate';
import { closeSnippet } from './close';
import { lockedPopupSnippet } from './lockedPopup';
import { openUrlSnippet } from './openUrl';

export function composeActionJs(action: ActionKind): string {
  switch (action.kind) {
    case 'helix':
      return helixSnippet();
    case 'template-duplicate':
      return templateDuplicateSnippet();
    case 'close':
      return closeSnippet();
    case 'locked-popup':
      return lockedPopupSnippet();
    case 'open-url':
      return openUrlSnippet(action.url);
    case 'custom':
      return action.js;
  }
}
