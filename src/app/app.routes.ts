import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './pages/layouts/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/sign-in',
    },

    {
        path: 'auth/sign-in',
        component: LoginPageComponent,
    },


    {
        path: 'superadmin',
        component: DashboardLayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: AdminDashboardComponent,
            },
        ],

    }
];
