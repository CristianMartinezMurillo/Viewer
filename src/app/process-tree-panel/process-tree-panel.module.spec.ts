import { ProcessTreePanelModule } from './process-tree-panel.module';

describe('ProcessTreePanelModule', () => {
  let processTreePanelModule: ProcessTreePanelModule;

  beforeEach(() => {
    processTreePanelModule = new ProcessTreePanelModule();
  });

  it('should create an instance', () => {
    expect(processTreePanelModule).toBeTruthy();
  });
});
