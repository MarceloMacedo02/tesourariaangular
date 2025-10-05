import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { 
    path: 'pages', 
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]  // Protect the pages route
  },
  { 
    path: 'detalhe-transacao/:id', 
    loadChildren: () => import('./components/detalhe-transacao/detalhe-transacao.module').then(m => m.DetalheTransacaoModule),
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: '/pages', pathMatch: 'full' }, // Default to pages which loads dashboard
  { path: '**', redirectTo: '/account/auth/signin' }  // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }