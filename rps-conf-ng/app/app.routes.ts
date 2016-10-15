import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { StartComponent } from './start.component';
import { SomeOtherComponent } from './some-other.component';
import { DetailsComponent } from './details.component';

// Purely an example
// Change the routes/components to meet your needs
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/1',
    pathMatch: 'full'
  },
  {
    path: "home/:id",
    component: HomeComponent
  },
  // '/someNavPage' pushed on nav stack using `page-router-outlet` (ie, push on a detail view with no drawer
  {
    path: "details/:id",
    component: DetailsComponent
  }
];