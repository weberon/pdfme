import React, { useEffect, useContext, ReactNode, useRef, useMemo } from 'react';
import {
  Mode,
  ZOOM,
  UIRenderProps,
  SchemaForUI,
  BasePdf,
  Schema,
  Plugin,
  UIOptions,
  cloneDeep,
} from '@pdfme/common';
import { theme as antdTheme } from 'antd';
import { SELECTABLE_CLASSNAME } from '../constants.js';
import { PluginsRegistry, OptionsContext, I18nContext, CacheContext } from '../contexts.js';

type RendererProps = Omit<
  UIRenderProps<Schema>,
  'schema' | 'rootElement' | 'options' | 'theme' | 'i18n' | '_cache'
> & {
  basePdf: BasePdf;
  schema: SchemaForUI;
  value: string;
  outline: string;
  onChangeHoveringSchemaId?: (id: string | null) => void;
  scale: number;
  selectable?: boolean;
};

type ReRenderCheckProps = {
  plugin?: Plugin<Schema>;
  value: string;
  mode: Mode;
  scale: number;
  schema: SchemaForUI;
  options: UIOptions;
};

const useRerenderDependencies = (arg: ReRenderCheckProps) => {
  const { plugin, value, mode, scale, schema, options } = arg;

  // Compute a stable, font-data-stripped options string.
  // This is memoized separately so it ONLY recomputes when options itself changes.
  const optionStr = useMemo(() => {
    const _options = cloneDeep(options);
    if (_options.font) {
      Object.values(_options.font).forEach((fontObj) => {
        (fontObj as { data: string }).data = '...';
      });
    }
    return JSON.stringify(_options);
  }, [options]);

  // Memoize the schema stringification to avoid repeating it on every single render
  // if the schema object identity hasn't changed.
  // Cosmetic highlight properties (borderColor, backgroundColor, etc.) are appended
  // separately so they are never lost to fingerprint truncation of large schemas.
  const schemaStr = useMemo(() => {
    const str = JSON.stringify(schema);
    const base = str.length > 256 ? `${str.length}:${str.slice(0, 32)}:${str.slice(-32)}` : str;
    const s = schema as any;
    return `${base}|${s.borderWidth ?? ''}|${s.borderColor ?? ''}|${s.backgroundColor ?? ''}|${s.borderPadding ?? ''}|${JSON.stringify(s.variableStyles ?? '')}`;
  }, [schema]);

  return useMemo(() => {
    if (plugin?.uninterruptedEditMode && mode === 'designer') {
      return [mode];
    } else {
      // Fingerprint 'value' if it's large to avoid allocating multi-MB dependency strings.
      const fingerprintValue = value.length > 256
        ? `${value.length}:${value.slice(0, 32)}:${value.slice(-32)}`
        : value;

      return [
        fingerprintValue,
        mode,
        scale,
        schemaStr,
        optionStr
      ];
    }
  }, [value, mode, scale, schemaStr, optionStr, plugin]);
};

const Wrapper = ({
  children,
  outline,
  onChangeHoveringSchemaId,
  schema,
  selectable = true,
}: RendererProps & { children: ReactNode }) => (
  <div
    title={schema.name}
    onMouseEnter={() => onChangeHoveringSchemaId && onChangeHoveringSchemaId(schema.id)}
    onMouseLeave={() => onChangeHoveringSchemaId && onChangeHoveringSchemaId(null)}
    className={selectable ? SELECTABLE_CLASSNAME : ''}
    id={schema.id}
    style={{
      position: 'absolute',
      cursor: schema.readOnly ? 'initial' : 'pointer',
      height: schema.height * ZOOM,
      width: schema.width * ZOOM,
      top: schema.position.y * ZOOM,
      left: schema.position.x * ZOOM,
      transform: `rotate(${schema.rotate ?? 0}deg)`,
      opacity: schema.opacity ?? 1,
      outline,
    }}
  >
    {schema.required && (
      <span
        style={{
          color: 'red',
          position: 'absolute',
          top: -12,
          left: -12,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        *
      </span>
    )}
    {children}
  </div>
);

const Renderer = (props: RendererProps) => {
  const { schema, basePdf, value, mode, onChange, stopEditing, tabIndex, placeholder, scale } =
    props;

  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const i18n = useContext(I18nContext) as (key: string) => string;
  const { token: theme } = antdTheme.useToken();

  const ref = useRef<HTMLDivElement>(null);
  const _cache = useContext(CacheContext);
  const plugin = pluginsRegistry.findByType(schema.type);

  const reRenderDependencies = useRerenderDependencies({
    plugin,
    value,
    mode,
    scale,
    schema,
    options,
  });

  useEffect(() => {
    if (!plugin?.ui || !ref.current || !schema.type) return;

    ref.current.innerHTML = '';
    const render = plugin.ui;

    void render({
      value,
      schema,
      basePdf,
      rootElement: ref.current,
      mode,
      onChange,
      stopEditing,
      tabIndex,
      placeholder,
      options,
      theme,
      i18n,
      scale,
      _cache,
    });

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, reRenderDependencies);

  if (!plugin) {
    console.error(`[@pdfme/ui] Renderer for type ${schema.type} not found. 
Check this document: https://pdfme.com/docs/custom-schemas`);
    return <></>;
  }

  return (
    <Wrapper {...props}>
      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </Wrapper>
  );
};
export default React.memo(Renderer, (prevProps, nextProps) => {
  // Deep equality check for stable Renderer re-renders.
  // This prevents the entire Renderer body from executing (including useMemo hooks)
  // unless a relevant property has changed.
  return (
    prevProps.value === nextProps.value &&
    prevProps.mode === nextProps.mode &&
    prevProps.scale === nextProps.scale &&
    prevProps.outline === nextProps.outline &&
    prevProps.selectable === nextProps.selectable &&
    // Schema is typically modified in-place or replaced. 
    // If it's the same object and other props match, we skip re-render.
    prevProps.schema === nextProps.schema &&
    prevProps.basePdf === nextProps.basePdf
  );
});
