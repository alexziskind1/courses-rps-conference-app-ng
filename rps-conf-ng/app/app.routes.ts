import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { StartComponent } from './start.component';
import { SomeOtherComponent } from './some-other.component';
import { DetailsComponent } from './details.component';
import { MapComponent } from './map.component';

// Purely an example
// Change the routes/components to meet your needs
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      // '/home' loaded into `router-outlet` in main content
      { path: "", component: StartComponent },
      // '/home/otherPath' loaded into `router-outlet` in main content
      { path: "otherPath", component: SomeOtherComponent },

      // etc.
    ]
  },
  // '/someNavPage' pushed on nav stack using `page-router-outlet` (ie, push on a detail view with no drawer
  { path: "details/:id", component: DetailsComponent },
  { path: "map/:id", component: MapComponent }
];