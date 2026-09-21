import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import 'katex/dist/katex.min.css';
import { getSection } from '@/lib/source/navigation';

// Project icons for the sidebar tab switcher, keyed by the top-level docs folder.
const projectIcons: Record<string, string> = {
  mat: '/docs-assets/matchzy/icon.svg',
  me: '/docs-assets/matchzy-enhanced/icon.svg',
  csm: '/docs-assets/server-manager/icon.svg',
};

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={source.getPageTree()}
      links={[
        // global header icons (Discord + personal GitHub)
        ...linkItems.filter((item) => item.type === 'icon'),
      ]}
      nav={{
        ...base.nav,
        title: (
          <>
            {logo}
            <span className="font-medium in-[.uwu]:hidden max-md:hidden">docs.sivert.io</span>
          </>
        ),
      }}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`;
            const projectIcon = projectIcons[meta.path.split('/', 1)[0] ?? ''];
            if (projectIcon) {
              return {
                ...option,
                icon: <img src={projectIcon} alt="" className="size-full rounded-lg" />,
              };
            }

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
