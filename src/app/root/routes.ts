import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../main/main';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

export const routing = RouterModule.forRoot(routes);
