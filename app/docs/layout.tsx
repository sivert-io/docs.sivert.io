import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import 'katex/dist/katex.min.css';
import { getSection } from '@/lib/source/navigation';
import { ProjectGithubInfo } from '@/components/docs/project-github-info';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={source.getPageTree()}
      links={[
        // global header icons (Discord + personal GitHub)
        ...linkItems.filter((item) => item.type === 'icon'),
        // per-project repo info (based on current /docs/<project> path)
        {
          type: 'custom',
          on: 'nav',
          secondary: true,
          children: <ProjectGithubInfo className="hidden lg:block lg:-mx-2" />,
        },
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
