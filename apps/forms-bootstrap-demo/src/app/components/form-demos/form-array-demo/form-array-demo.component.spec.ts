import { TestBed } from '@angular/core/testing';
import { FormArrayDemoComponent } from './form-array-demo.component';
import { NgsFormsService } from '@ng-simplicity/forms-core';

describe('FormArrayDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormArrayDemoComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize the form configuration on init', () => {
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    const setFormConfigSpy = jest.spyOn(component.ngsFormsService, 'setFormConfig');
    
    component.ngOnInit();
    
    expect(setFormConfigSpy).toHaveBeenCalled();
    const config = setFormConfigSpy.mock.calls[0][0];
    expect(config.root.config.name).toBe('demoForm');
  });

  it('should log the values and alert when a valid form is submitted', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component, 'isValid', 'get').mockReturnValue(true);

    component.onSubmit();

    expect(logSpy).toHaveBeenCalledWith('Form is VALID! Submitted values:', component.ngsFormsService.formValue);
    expect(alertSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should warn and not alert when an invalid form is submitted', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component, 'isValid', 'get').mockReturnValue(false);

    component.onSubmit();

    expect(warnSpy).toHaveBeenCalledWith('Form is INVALID. Please correct errors and try again.');
    expect(alertSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
