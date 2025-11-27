import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyComicsComponent } from './pages/my-comics/my-comics.component';
import { LoginPageComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-comics', component: MyComicsComponent },
  { path: 'login', component: LoginPageComponent }
];
