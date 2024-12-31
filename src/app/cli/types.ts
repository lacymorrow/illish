import { z } from 'zod';

export const componentConfigSchema = z.object({
  style: z.enum(['default', 'new-york']),
  tailwind: z.object({
    config: z.string(),
    baseColor: z.string(),
    css: z.string(),
  }),
  aliases: z.record(z.string()).optional(),
  typescript: z.boolean(),
  jsx: z.enum(['jsx', 'tsx']),
  components: z.array(z.string()),
});

export type ComponentConfig = z.infer<typeof componentConfigSchema>;

export interface ComponentRegistryItem {
  name: string;
  dependencies: string[];
  files: {
    name: string;
    content: string;
  }[];
}

export interface AddComponentOptions {
  name: string;
  targetPath?: string;
  config: ComponentConfig;
}

export interface ComponentFile {
  path: string;
  content: string;
  type: string;
  target: string;
}

export interface RegistryComponent {
  name: string;
  type: string;
  dependencies: string[];
  files: ComponentFile[];
  tailwind?: {
    config: {
      theme: {
        extend: Record<string, any>;
      };
    };
  };
}
