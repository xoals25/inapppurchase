import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'purchase2',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'purchase1',
    pathMatch: 'full'
  },
  {
    path: 'purchase1',
    loadChildren: () => import('./home-in-app-purchase1/home-in-app-purchase1.module').then( m => m.HomeInAppPurchase1PageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
