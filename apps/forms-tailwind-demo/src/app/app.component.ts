import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsTailwindDemoHeaderComponent } from './components/header/forms-tailwind-demo-header.component';

@Component({
  imports: [RouterModule, FormsTailwindDemoHeaderComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'forms-tailwind-demo';
}
