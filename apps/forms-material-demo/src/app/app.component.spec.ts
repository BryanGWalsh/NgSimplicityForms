import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the dynamic form configuration on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const setConfigSpy = jest.spyOn(app.ngsFormsService, 'setFormConfig');

    app.ngOnInit();
    
    expect(setConfigSpy).toHaveBeenCalled();
    const passedConfig = setConfigSpy.mock.calls[0][0];
    expect(passedConfig.root.config.name).toEqual('materialDemoForm');
    expect(passedConfig.inputUpdateDebounce).toBe(150);
  });

  it('should expose submit, reset, and sample data actions', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(typeof app.onSubmit).toBe('function');
    expect(typeof app.onReset).toBe('function');
    expect(typeof app.onLoadSampleData).toBe('function');

    app.onSubmit();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
