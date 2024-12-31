"use client";

import { CodeViewer } from "@/app/(app)/(demo)/examples/playground/components/code-viewer";
import { CodeWindow } from "@/components/ui/code-window";

const sampleCode = `// Example TypeScript code
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
};`;

const longCode = `// Long code example with many lines
import { useState, useEffect } from 'react';

interface DataItem {
  id: number;
  name: string;
  value: number;
}

export const DataComponent = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Value: {item.value}</p>
        </div>
      ))}
    </div>
  );
};`;

const CodeDisplayPage = () => {
	return (
		<div className="container mx-auto space-y-12 p-8">
			<div className="prose max-w-none dark:prose-invert">
				<h1>Code Display Components</h1>
				<p>
					A comparison of different code display components available in the
					codebase.
				</p>
			</div>

			<section className="space-y-4">
				<h2 className="text-2xl font-bold">1. CodeWindow Component</h2>
				<p className="text-muted-foreground">
					Full-featured code display with syntax highlighting, copy button, and
					window controls.
				</p>

				<div className="prose max-w-none dark:prose-invert">
					<span className="block">
						You can use the inline variant for short commands like{" "}
						<CodeWindow
							code="npm install @shadcn/ui"
							language="bash"
							variant="inline"
							showLineNumbers={false}
						/>{" "}
						or{" "}
						<CodeWindow
							code="pnpm add -D typescript"
							language="bash"
							variant="inline"
							showLineNumbers={false}
						/>{" "}
						within text. It&apos;s perfect for CLI commands, package names like{" "}
						<CodeWindow
							code="@types/react"
							language="text"
							variant="inline"
							showLineNumbers={false}
						/>
						, or short code snippets like{" "}
						<CodeWindow
							code="const x: number = 42;"
							language="typescript"
							variant="inline"
							showLineNumbers={false}
						/>
						.
					</span>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Default Variant (Dark)</h3>
						<CodeWindow
							title="Example.ts"
							code={sampleCode}
							language="typescript"
							showCopy={true}
							showLineNumbers={true}
							highlightLines={[2, 3, 4, 5]}
							theme="dark"
							variant="default"
						/>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Minimal Variant</h3>
						<CodeWindow
							title="Example.ts"
							code={sampleCode}
							language="typescript"
							showCopy={true}
							showLineNumbers={true}
							theme="light"
							variant="minimal"
						/>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Ghost Variant</h3>
						<CodeWindow
							code={sampleCode}
							language="typescript"
							showCopy={false}
							showLineNumbers={false}
							theme="dark"
							variant="ghost"
						/>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Small Size</h3>
						<CodeWindow
							title="Example.ts"
							code={sampleCode}
							language="typescript"
							showCopy={true}
							showLineNumbers={true}
							theme="dark"
							variant="default"
							size="sm"
						/>
					</div>
					<div className="col-span-2 space-y-4">
						<h3 className="text-lg font-semibold">
							Large Size with Line Numbers & Highlighting
						</h3>
						<CodeWindow
							title="DataComponent.tsx"
							code={longCode}
							language="typescript"
							showCopy={true}
							showLineNumbers={true}
							highlightLines={[14, 15, 16]}
							theme="dark"
							variant="default"
							size="lg"
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-bold">2. CodeViewer Component</h2>
				<p className="text-muted-foreground">
					Dialog-based code viewer with custom syntax highlighting.
				</p>
				<CodeViewer />
			</section>
		</div>
	);
};

export default CodeDisplayPage;
