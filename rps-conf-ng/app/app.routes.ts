import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { StartComponent } from './start.component';
import { SomeOtherComponent } from './some-other.component';
import { DetailsComponent } from './details.component';
import { MapComponent } from './map.component';

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
  {
    path: "details/:id",
    component: DetailsComponent
  },
  {
    path: "map/:id",
    component: MapComponent
  }
];