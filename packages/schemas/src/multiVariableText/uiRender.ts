import { getDefaultFont, UIRenderProps } from '@pdfme/common';
import { MultiVariableTextSchema } from './types.js';
import {
  uiRender as parentUiRender,
  buildStyledTextContainer,
  makeElementPlainTextContentEditable,
} from '../text/uiRender.js';
import { isEditable } from '../utils.js';
import { getFontKitFont } from '../text/helper.js';
import { substituteVariables } from './helper.js';

export const uiRender = async (arg: UIRenderProps<MultiVariableTextSchema>) => {
  const { value, schema, rootElement, mode, onChange, ...rest } = arg;

  let text = schema.text;
  let numVariables = schema.variables.length;

  if (mode === 'form' && numVariables > 0) {
    await formUiRender(arg);
    return;
  }

  if (mode === 'viewer' && schema.variableStyles) {
    await styledViewerRender(arg);
    return;
  }

  await parentUiRender({
    value: isEditable(mode, schema) ? text : substituteVariables(text, value),
    schema,
    mode: mode === 'form' ? 'viewer' : mode, // if no variables for form it's just a viewer
    rootElement,
    onChange: (arg: { key: string; value: unknown } | { key: string; value: unknown }[]) => {
      if (!Array.isArray(arg)) {
        if (onChange) {
          onChange({ key: 'text', value: arg.value });
        }
      } else {
        throw new Error('onChange is not an array, the parent text plugin has changed...');
      }
    },
    ...rest,
  });

  const textBlock = rootElement.querySelector('#text-' + String(schema.id)) as HTMLDivElement;
  if (!textBlock) {
    throw new Error('Text block not found. Ensure the text block has an id of "text-" + schema.id');
  }

  if (mode === 'designer') {
    textBlock.addEventListener('keyup', (event: KeyboardEvent) => {
      text = textBlock.textContent || '';
      if (keyPressShouldBeChecked(event)) {
        const newNumVariables = countUniqueVariableNames(text);
        if (numVariables !== newNumVariables) {
          // If variables were modified during this keypress, we trigger a change
          if (onChange) {
            onChange({ key: 'text', value: text });
          }
          numVariables = newNumVariables;
        }
      }
    });
  }
};

const styledViewerRender = async (arg: UIRenderProps<MultiVariableTextSchema>) => {
  const { value, schema, rootElement, options, _cache } = arg;
  const rawText = schema.text;
  const variables: Record<string, string> = value
    ? (JSON.parse(value) as Record<string, string>) || {}
    : {};
  const variableIndices = getVariableIndices(rawText);
  const substitutedText = substituteVariables(rawText, variables);
  const font = options?.font || getDefaultFont();
  const fontKitFont = await getFontKitFont(
    schema.fontName,
    font,
    _cache as Map<string, import('fontkit').Font>,
  );

  const textBlock = buildStyledTextContainer(arg, fontKitFont, substitutedText);
  textBlock.innerHTML = ''; // Clear because buildStyledTextContainer might have filled it

  const styles: Record<string, any> = schema.variableStyles || {};

  let inVarString = false;
  for (let i = 0; i < rawText.length; i++) {
    if (variableIndices[i]) {
      inVarString = true;
      const varName = variableIndices[i];
      let span = document.createElement('span');
      span.dataset.pdfmeVarName = varName;
      if (styles[varName]) {
        Object.assign(span.style, styles[varName]);
        if (!styles[varName].borderRadius) span.style.borderRadius = '2px';
        if (!styles[varName].padding) span.style.padding = '0 2px';
      }
      span.textContent = variables[varName] || '';
      textBlock.appendChild(span);
    } else if (inVarString) {
      if (rawText[i] === '}') {
        inVarString = false;
      }
    } else {
      let span = document.createElement('span');
      span.textContent = rawText[i];
      textBlock.appendChild(span);
    }
  }
};

const formUiRender = async (arg: UIRenderProps<MultiVariableTextSchema>) => {
  const { value, schema, rootElement, onChange, stopEditing, theme, _cache, options } = arg;
  const rawText = schema.text;

  if (rootElement.parentElement) {
    // remove the outline for the whole schema, we'll apply outlines on each individual variable field instead
    rootElement.parentElement.style.outline = '';
  }

  const variables: Record<string, string> = value
    ? (JSON.parse(value) as Record<string, string>) || {}
    : {};
  const variableIndices = getVariableIndices(rawText);
  const substitutedText = substituteVariables(rawText, variables);
  const font = options?.font || getDefaultFont();
  const fontKitFont = await getFontKitFont(
    schema.fontName,
    font,
    _cache as Map<string, import('fontkit').Font>,
  );

  const textBlock = buildStyledTextContainer(arg, fontKitFont, substitutedText);
  textBlock.innerHTML = '';

  const styles: Record<string, any> = schema.variableStyles || {};

  // Construct content-editable spans for each variable within the string
  let inVarString = false;

  for (let i = 0; i < rawText.length; i++) {
    if (variableIndices[i]) {
      inVarString = true;
      const varName = variableIndices[i];
      let span = document.createElement('span');
      span.dataset.pdfmeVarName = varName;
      
      if (styles[varName]) {
        Object.assign(span.style, styles[varName]);
        if (!styles[varName].outline) span.style.outline = `${theme.colorPrimary} dashed 1px`;
        if (!styles[varName].borderRadius) span.style.borderRadius = '2px';
        if (!styles[varName].padding) span.style.padding = '0 2px';
      } else {
        span.style.outline = `${theme.colorPrimary} dashed 1px`;
      }

      makeElementPlainTextContentEditable(span);
      span.textContent = variables[varName] || '';
      span.addEventListener('blur', (e: Event) => {
        const newValue = (e.target as HTMLSpanElement).textContent || '';
        if (newValue !== variables[varName]) {
          variables[varName] = newValue;
          if (onChange) onChange({ key: 'content', value: JSON.stringify(variables) });
          if (stopEditing) stopEditing();
        }
      });
      textBlock.appendChild(span);
    } else if (inVarString) {
      if (rawText[i] === '}') {
        inVarString = false;
      }
    } else {
      let span = document.createElement('span');
      span.style.letterSpacing = rawText.length === i + 1 ? '0' : 'inherit';
      span.textContent = rawText[i];
      textBlock.appendChild(span);
    }
  }
};

const getVariableIndices = (content: string) => {
  const regex = /\{([^}]+)}/g;
  const indices = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    indices[match.index] = match[1];
  }

  return indices;
};

const countUniqueVariableNames = (content: string) => {
  const regex = /\{([^}]+)}/g;
  const uniqueMatchesSet = new Set();
  let match;

  while ((match = regex.exec(content)) !== null) {
    uniqueMatchesSet.add(match[1]);
  }

  return uniqueMatchesSet.size;
};

/**
 * An optimisation to try to minimise jank while typing.
 * Only check whether variables were modified based on certain key presses.
 * Regex would otherwise be performed on every key press (which isn't terrible, but this code helps).
 */
const keyPressShouldBeChecked = (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight'
  ) {
    return false;
  }

  const selection = window.getSelection();
  const contenteditable = event.target as HTMLDivElement;

  const isCursorAtEnd = selection?.focusOffset === contenteditable?.textContent?.length;
  if (isCursorAtEnd) {
    return event.key === '}' || event.key === 'Backspace' || event.key === 'Delete';
  }

  const isCursorAtStart = selection?.anchorOffset === 0;
  if (isCursorAtStart) {
    return event.key === '{' || event.key === 'Backspace' || event.key === 'Delete';
  }

  return true;
};
