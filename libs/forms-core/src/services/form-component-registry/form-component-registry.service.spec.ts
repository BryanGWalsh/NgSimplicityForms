import { TestBed } from '@angular/core/testing';
import { NgsFormsComponentRegistryService } from './form-component-registry.service';
import { Component } from '@angular/core';

@Component({
  template: '',
  standalone: true
})
class MockComponent {}

describe('NgsFormsComponentRegistryService', () => {
  let service: NgsFormsComponentRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgsFormsComponentRegistryService]
    });
    service = TestBed.inject(NgsFormsComponentRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and retrieve component types by key', () => {
    expect(service.getComponentTypeForKey('test-key')).toBeUndefined();

    service.register('test-key', MockComponent);

    expect(service.getComponentTypeForKey('test-key')).toBe(MockComponent);
  });
});
