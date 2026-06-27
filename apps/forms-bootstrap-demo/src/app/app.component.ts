import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsBootstrapDemoHeaderComponent } from './components/header/forms-bootstrap-demo-header.component';

@Component({
  imports: [RouterModule, FormsBootstrapDemoHeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'forms-bootstrap-demo';
}
