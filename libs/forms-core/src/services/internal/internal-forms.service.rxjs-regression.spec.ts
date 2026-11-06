import { NgsFormsInternalService } from './internal-forms.service';

describe('NgsFormsInternalService.subscribeToState', () => {
  it('every subscriber to the returned observable receives the current state', () => {
    const service = new NgsFormsInternalService();
    service.updateGlobalState({ displayMode: 'summary' } as any);
    const state$ = service.subscribeToState('uuid-1', 'name');
    const a: any[] = [];
    const b: any[] = [];
    state$.subscribe((s) => a.push(s));
    state$.subscribe((s) => b.push(s));
    expect(a.length).toBe(1);
    expect(b.length).toBe(1);
  });
});
