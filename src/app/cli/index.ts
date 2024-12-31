import { AddComponentOptions, ComponentConfig } from './types';
import { getComponent, fetchComponentDefinition, registerComponent } from './registry';

export class ProgrammaticCLI {
  private config: ComponentConfig;

  constructor(config: ComponentConfig) {
    this.config = config;
  }

  async addComponent({ name, targetPath, config = this.config }: AddComponentOptions) {
    try {
      // 1. Get or fetch component definition
      let component = await getComponent(name);
      if (!component) {
        component = await fetchComponentDefinition(name);
        if (component) {
          await registerComponent(name, component);
        }
      }

      if (!component) {
        throw new Error(`Component ${name} not found`);
      }

      // 2. Transform component files based on config
      const transformedFiles = component.files.map(file => ({
        ...file,
        content: this.transformContent(file.content, config),
      }));

      // 3. Instead of writing files directly, return the transformed content
      return {
        success: true,
        files: transformedFiles.map(file => ({
          path: file.path,
          content: file.content
        })),
      };
    } catch (error) {
      console.error('Failed to add component:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private transformContent(content: string, config: ComponentConfig): string {
    // TODO: Implement content transformation based on config
    // This should handle:
    // - TypeScript/JavaScript conversion
    // - Style transformations
    // - Path aliases
    return content;
  }
}

// Export a factory function for easier instantiation
export function createCLI(config: ComponentConfig) {
  return new ProgrammaticCLI(config);
}
