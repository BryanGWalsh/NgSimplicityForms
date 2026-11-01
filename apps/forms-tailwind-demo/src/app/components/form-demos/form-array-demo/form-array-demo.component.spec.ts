import { TestBed } from '@angular/core/testing';
import { FormArrayDemoComponent } from './form-array-demo.component';

describe('FormArrayDemoComponent (Tailwind)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormArrayDemoComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    expect(fixture.componentInstance).toBeTruthy();
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

  it('should mark the form as submitted and warn while it is invalid', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const fixture = TestBed.createComponent(FormArrayDemoComponent);
    const component = fixture.componentInstance;
    const submittedSpy = jest.spyOn(component.ngsFormsService, 'setIsSubmitted');
    jest.spyOn(component, 'isValid', 'get').mockReturnValue(false);

    component.onSubmit();

    expect(component.isSubmitted()).toBe(true);
    expect(submittedSpy).toHaveBeenCalledWith(true);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
