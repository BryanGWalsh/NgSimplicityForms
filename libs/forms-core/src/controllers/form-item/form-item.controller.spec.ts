import { Injector, ViewContainerRef, Component, ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgsFormItemController } from './form-item.controller';
import { NgsFormsComponentRegistryService } from '../../services/form-component-registry/form-component-registry.service';
import { NgsFormsFormItem } from '../../models';
import { BehaviorSubject } from 'rxjs';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_ITEM_INDEX, NGS_FORMS_CONTROL_ADD_REMOVE_FN } from '../../misc';

@Component({
  template: '',
  standalone: true
})
class MockFormComponent {}

describe('NgsFormItemController', () => {
  let registryService: NgsFormsComponentRegistryService;
  let mockViewContainerRef: jest.Mocked<ViewContainerRef>;
  let mockComponentRef: jest.Mocked<ComponentRef<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgsFormsComponentRegistryService
      ]
    });
    registryService = TestBed.inject(NgsFormsComponentRegistryService);
    registryService.register('mock-component', MockFormComponent);

    mockComponentRef = {
      destroy: jest.fn(),
      instance: {}
    } as any;

    mockViewContainerRef = {
      createComponent: jest.fn().mockReturnValue(mockComponentRef)
    } as any;
  });

  it('should instantiate and create component immediately if visible$ is not provided', () => {
    const itemData: NgsFormsFormItem<any> = {
      uuid: '123',
      type: 'mock-component',
      config: {}
    };

    const controller = new NgsFormItemController(
      TestBed.inject(Injector),
      mockViewContainerRef,
      itemData
    );

    expect(mockViewContainerRef.createComponent).toHaveBeenCalled();
    const createComponentMock = mockViewContainerRef.createComponent as any;
    const mockInjector = createComponentMock.mock.calls[0][1]?.injector;
    expect(mockInjector?.get(NGS_FORMS_ITEM_DATA)).toBe(itemData);

    controller.destroy();
    expect(mockComponentRef.destroy).toHaveBeenCalled();
  });

  it('should listen to visible$ and create/detach component accordingly', () => {
    const visible$ = new BehaviorSubject<boolean>(false);
    const itemData: NgsFormsFormItem<any> = {
      uuid: '123',
      type: 'mock-component',
      config: {},
      visible$
    };

    const controller = new NgsFormItemController(
      TestBed.inject(Injector),
      mockViewContainerRef,
      itemData
    );

    // Initial state is false, so createComponent shouldn't be called yet
    expect(mockViewContainerRef.createComponent).not.toHaveBeenCalled();

    // Toggle to true
    visible$.next(true);
    expect(mockViewContainerRef.createComponent).toHaveBeenCalledTimes(1);

    // Toggle back to false
    visible$.next(false);
    expect(mockComponentRef.destroy).toHaveBeenCalledTimes(1);

    controller.destroy();
  });

  it('should pass index and addRemoveControlFn if provided', () => {
    const itemData: NgsFormsFormItem<any> = {
      uuid: '123',
      type: 'mock-component',
      config: {}
    };
    const mockAddRemoveFn = {
      add: jest.fn(),
      remove: jest.fn()
    };

    const controller = new NgsFormItemController(
      TestBed.inject(Injector),
      mockViewContainerRef,
      itemData,
      mockAddRemoveFn,
      5
    );

    expect(mockViewContainerRef.createComponent).toHaveBeenCalled();
    const createComponentMock = mockViewContainerRef.createComponent as any;
    const mockInjector = createComponentMock.mock.calls[0][1]?.injector;
    expect(mockInjector?.get(NGS_FORMS_ITEM_INDEX)).toBe(5);
    expect(mockInjector?.get(NGS_FORMS_CONTROL_ADD_REMOVE_FN)).toBe(mockAddRemoveFn);

    controller.destroy();
  });

  it('should log error if component type is not registered', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const itemData: NgsFormsFormItem<any> = {
      uuid: '123',
      type: 'unregistered-component',
      config: {}
    };

    const controller = new NgsFormItemController(
      TestBed.inject(Injector),
      mockViewContainerRef,
      itemData
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith('Ngs form component type unregistered-component not registered.');
    expect(mockViewContainerRef.createComponent).not.toHaveBeenCalled();

    controller.destroy();
    consoleErrorSpy.mockRestore();
  });
});
