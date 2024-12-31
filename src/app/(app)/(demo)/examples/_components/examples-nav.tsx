import { Link } from "@/components/primitives/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { examples } from "@/app/(app)/(demo)/examples/_components/example-app-section";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {
  current?: string;
}

export function ExamplesNav({
  className,
  current = "Music",
  ...props
}: ExamplesNavProps) {
  return (
    <div className="relative w-full">
      <ScrollArea className="mx-auto max-w-[600px] [mask-image:linear-gradient(to_right,transparent,white_7%,white_93%,transparent)]">
        <div className={cn("mb-4 flex items-center", className)} {...props}>
          {examples.map((example) => (
            <Link
              href={`?example=${example.name}`}
              key={example.href}
              scroll={false}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                current === example.name
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}

interface ExampleCodeLinkProps {
  pathname: string | null;
}

export function ExampleCodeLink({ pathname }: ExampleCodeLinkProps) {
  const example = examples.find((example) =>
    pathname?.startsWith(example.href),
  );

  if (!example?.code) {
    return null;
  }

  return (
    <Link
      href={example?.code}
      target="_blank"
      rel="nofollow"
      className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex"
    >
      View code
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
