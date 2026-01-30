import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyComicsComponent } from './pages/my-comics/my-comics.component';
import { LoginPageComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { FindComicsComponent } from './pages/find-comics/find-comics.component';
import { SignOutPageComponent } from './pages/signout/signout.component';
import { ComicDetailsPageComponent } from './pages/comic-details/comic-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-comics', component: MyComicsComponent },
  { path: 'find-comics', component: FindComicsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signout', component: SignOutPageComponent },
  { path: 'comic-details', component: ComicDetailsPageComponent },
];
