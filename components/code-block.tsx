import * as Base from 'fumadocs-ui/components/codeblock';
import { highlight } from 'fumadocs-core/highlight';
import { cn } from '@/lib/cn';

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: string;
}

export async function CodeBlock({ code, lang, wrapper }: CodeBlockProps) {
  // `highlight()` loads the language and themes on demand and converts the
  // result to JSX, which this used to do by hand with a shared highlighter and
  // `hastToJsx` — an export fumadocs-core no longer has.
  const rendered = await highlight(code, {
    lang,
    defaultColor: false,
    themes: {
      light: 'github-light',
      dark: 'vesper',
    },
    components: {
      pre: Base.Pre,
    },
  });

  return (
    <Base.CodeBlock {...wrapper} className={cn('my-0', wrapper?.className)}>
      {rendered}
    </Base.CodeBlock>
  );
}
