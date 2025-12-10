import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';

export const routes: Routes = [
    { path: '', component: LandingpageComponent},
    { path: 'admin', component: AdminpanelComponent}
];
