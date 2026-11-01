import { NgsFormsCoreModule } from './forms-core.module';
import { NgsFormsComponentRegistryService } from './services/form-component-registry/form-component-registry.service';
import { NgsFormsHtmlContentComponent } from './components/shared-form-components/html-content/html-content.component';

describe('NgsFormsCoreModule.registerCoreNgsFormComponents', () => {
  it('registers the content-html component', () => {
    const registry = new NgsFormsComponentRegistryService();
    NgsFormsCoreModule.registerCoreNgsFormComponents(registry);
    expect(registry.getComponentTypeForKey('content-html')).toBe(NgsFormsHtmlContentComponent);
  });
});
