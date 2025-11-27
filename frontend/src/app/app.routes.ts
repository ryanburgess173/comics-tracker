import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyComicsComponent } from './pages/my-comics/my-comics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-comics', component: MyComicsComponent },
];
