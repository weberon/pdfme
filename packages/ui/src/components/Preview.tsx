import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';
import {
  Template,
  SchemaForUI,
  PreviewProps,
  Size,
  getDynamicTemplate,
  replacePlaceholders,
} from '@pdfme/common';
import { getDynamicHeightsForTable } from '@pdfme/schemas/utils';
import UnitPager from './UnitPager.js';
import Root from './Root.js';
import StaticSchema from './StaticSchema.js';
import ErrorScreen from './ErrorScreen.js';
import CtlBar from './CtlBar.js';
import Paper from './Paper.js';
import Renderer from './Renderer.js';
import { useUIPreProcessor, useScrollPageCursor } from '../hooks.js';
import { FontContext, OptionsContext, CacheContext } from '../contexts.js';
import { template2SchemasList, getPagesScrollTopByIndex, useMaxZoom } from '../helper.js';
import { theme } from 'antd';


const RendererItem = React.memo(({ schema, value, mode, placeholder, tabIndex, outline, scale, index, basePdf, onChange }: {
  schema: SchemaForUI;
  value: string;
  mode: 'viewer' | 'form';
  placeholder?: string;
  tabIndex: number;
  outline: string;
  scale: number;
  index: number;
  basePdf: any; // Use any to avoid stubborn type mismatches with complex Template union
  onChange: (arg: { key: string; value: unknown } | { key: string; value: unknown }[], schema: SchemaForUI) => void;
}) => {
  const _onChange = React.useCallback((arg: { key: string; value: unknown } | { key: string; value: unknown }[]) => {
    onChange(arg, schema);
  }, [onChange, schema]);

  return (
    <Renderer
      key={schema.id}
      schema={schema}
      basePdf={basePdf}
      value={value}
      mode={mode}
      placeholder={placeholder}
      tabIndex={tabIndex}
      outline={outline}
      scale={scale}
      onChange={_onChange}
    />
  );
});

const Preview = ({
  template,
  inputs,
  size,
  onChangeInput,
  onPageChange,
}: Omit<PreviewProps, 'domContainer'> & {
  onChangeInput?: (args: { index: number; value: string; name: string }) => void;
  onPageChange?: (pageInfo: { currentPage: number; totalPages: number }) => void;
  size: Size;
}) => {
  const { token } = theme.useToken();

  const font = useContext(FontContext);
  const options = useContext(OptionsContext);
  const _cache = useContext(CacheContext);
  const maxZoom = useMaxZoom();

  const containerRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);

  const [unitCursor, setUnitCursor] = useState(0);
  const [pageCursor, setPageCursor] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);

  // Structural fingerprint: changes only when template layout/content changes,
  // NOT when cosmetic highlight properties (borderColor, backgroundColor, variableStyles) change.
  const templateStructureKey = useMemo(() => {
    return JSON.stringify({
      basePdfId: typeof template.basePdf === 'string' ? template.basePdf.length : JSON.stringify(template.basePdf),
      schemas: template.schemas.map(page =>
        page.map(s => ({
          n: s.name,
          t: s.type,
          x: s.position?.x,
          y: s.position?.y,
          w: s.width,
          h: s.height,
          c: s.content,
          ro: s.readOnly,
        }))
      ),
    });
  }, [template]);

  const prevStructureKeyRef = useRef<string>('');

  const { backgrounds, pageSizes, scale, error, refresh } = useUIPreProcessor({
    template,
    size,
    zoomLevel,
    maxZoom,
  });

  const isForm = Boolean(onChangeInput);

  const input = inputs[unitCursor];

  const init = (template: Template, inputOverride?: Record<string, string>) => {
    const currentInput = inputOverride ?? input;
    const options = { font };
    getDynamicTemplate({
      template,
      input: currentInput,
      options,
      _cache,
      getDynamicHeights: (value, args) => {
        switch (args.schema.type) {
          case 'table':
            return getDynamicHeightsForTable(value, args);
          default:
            return Promise.resolve([args.schema.height]);
        }
      },
    })
      .then(async (dynamicTemplate) => {
        const sl = await template2SchemasList(dynamicTemplate);
        setSchemasList(sl);
        await refresh(dynamicTemplate);
      })
      .catch((err) => console.error(`[@pdfme/ui] `, err));
  };

  // Update component state only when _options_ changes
  // Ignore exhaustive useEffect dependency warnings here
  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
    // eslint-disable-next-line
  }, [options]);

  // Full re-initialization ONLY when template STRUCTURE or viewport size changes.
  // Cosmetic changes (highlighting) update schemasList styles in-place without expensive init().
  useEffect(() => {
    if (templateStructureKey !== prevStructureKeyRef.current) {
      // Structural change (new template loaded, schema added/removed, position changed)
      prevStructureKeyRef.current = templateStructureKey;
      init(template);
    } else {
      // Cosmetic-only change (highlight border/background/variableStyles)
      // Copy style props from the new template schemas onto existing schemasList entries.
      setSchemasList(prev => {
        if (!prev || prev.length === 0 || prev[0].length === 0) return prev;
        return prev.map((page, pageIdx) =>
          page.map((schema, schemaIdx) => {
            const source = (template.schemas[pageIdx]?.[schemaIdx]) as any;
            if (!source) return schema;
            
            // Optimization: If cosmetic properties haven't changed, return the existing schema object
            // to preserve its identity and avoid redundant re-renders of the Renderer.
            const s = schema as any;
            if (
              s.borderWidth === source.borderWidth &&
              s.borderColor === source.borderColor &&
              s.backgroundColor === source.backgroundColor &&
              s.variableStyles === source.variableStyles &&
              s.borderPadding === source.borderPadding
            ) {
              return schema;
            }

            return {
              ...schema,
              borderWidth: source.borderWidth,
              borderColor: source.borderColor,
              backgroundColor: source.backgroundColor,
              variableStyles: source.variableStyles,
              borderPadding: source.borderPadding,
            };

          })
        );
      });
    }
    // eslint-disable-next-line
  }, [template, size]);

  // Keep unitCursor in bounds when the number of inputs shrinks (e.g. after a unit is deleted).
  // This does NOT re-initialize the canvas — only bounds-checks the cursor.
  useEffect(() => {
    if (unitCursor > inputs.length - 1) {
      setUnitCursor(inputs.length - 1);
    }
    // eslint-disable-next-line
  }, [inputs]);

  useScrollPageCursor({
    ref: containerRef,
    pageSizes,
    scale,
    pageCursor,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      if (onPageChange) {
        onPageChange({ currentPage: p, totalPages: schemasList.length });
      }
    },
  });

  const handleChangeInput = ({ name, value }: { name: string; value: string }) =>
    onChangeInput && onChangeInput({ index: unitCursor, name, value });

  const handleOnChangeRenderer = (args: { key: string; value: unknown }[], schema: SchemaForUI) => {
    let isNeedInit = false;
    let newInputValue: string | undefined;

    args.forEach(({ key: _key, value }) => {
      if (_key === 'content') {
        const newValue = value as string;
        const oldValue = (input?.[schema.name] as string) || '';
        if (newValue === oldValue) return;
        handleChangeInput({ name: schema.name, value: newValue });
        // TODO Improve this to allow schema types to determine whether the execution of getDynamicTemplate is required.
        if (schema.type === 'table') {
          isNeedInit = true;
          newInputValue = newValue;
        }
      } else {
        const targetSchema = schemasList[pageCursor].find((s) => s.id === schema.id) as SchemaForUI;
        if (!targetSchema) return;

        // @ts-expect-error Dynamic property assignment
        targetSchema[_key] = value as string;
      }
    });
    if (isNeedInit && newInputValue !== undefined) {
      // Pass the updated input directly to recalculate with new value
      const updatedInput = { ...input, [schema.name]: newInputValue };
      init(template, updatedInput);
    }
    setSchemasList([...schemasList]);
  };

  const handleOnChangeRendererStable = React.useCallback(
    (arg: { key: string; value: unknown } | { key: string; value: unknown }[], schema: SchemaForUI) => {
      const args = Array.isArray(arg) ? arg : [arg];
      handleOnChangeRenderer(args, schema);
    },
    [handleOnChangeRenderer],
  );

  if (error) {
    return <ErrorScreen size={size} error={error} />;
  }

  return (
    <Root size={size} scale={scale}>
      <CtlBar
        size={size}
        pageCursor={pageCursor}
        pageNum={schemasList.length}
        setPageCursor={(p) => {
          if (!containerRef.current) return;
          containerRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, p, scale);
          setPageCursor(p);
          if (onPageChange) {
            onPageChange({ currentPage: p, totalPages: schemasList.length });
          }
        }}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />
      <UnitPager
        size={size}
        unitCursor={unitCursor}
        unitNum={inputs.length}
        setUnitCursor={setUnitCursor}
      />
      <div ref={containerRef} style={{ ...size, position: 'relative', overflow: 'auto' }}>
        <Paper
          paperRefs={paperRefs}
          scale={scale}
          size={size}
          schemasList={schemasList}
          pageSizes={pageSizes}
          backgrounds={backgrounds}
          renderSchema={({ schema, index }) => {
            const value = schema.readOnly
              ? replacePlaceholders({
                content: schema.content || '',
                variables: { ...input, totalPages: schemasList.length, currentPage: index + 1 },
                schemas: schemasList,
              })
              : String((input && input[schema.name]) || '');
            return (
              <RendererItem
                key={schema.id}
                schema={schema}
                value={value}
                mode={isForm ? 'form' : 'viewer'}
                placeholder={schema.content}
                tabIndex={index + 100}
                onChange={handleOnChangeRendererStable}
                outline={
                  isForm && !schema.readOnly ? `1px dashed ${token.colorPrimary}` : 'transparent'
                }
                scale={scale}
                index={index}
                basePdf={template.basePdf}
              />
            );
          }}
          renderPaper={({ index }) => (
            <StaticSchema
              template={template}
              scale={scale}
              input={input}
              totalPages={schemasList.length}
              currentPage={index + 1}
            />
          )}
        />
      </div>
    </Root>
  );
};

export default Preview;
