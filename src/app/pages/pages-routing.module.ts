import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

// Layout Component
import { LayoutComponent } from '../layouts/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],  // Protect all pages routes
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
      },
      {
        path: 'apps',
        loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
      },
      {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then(m => m.UiModule)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
      },
      {
        path: 'advance-ui',
        loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule)
      },
      {
        path: 'cadastros',
        loadChildren: () => import('./cadastros/cadastros.module').then(m => m.CadastrosModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
