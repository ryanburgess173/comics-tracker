import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ComicService } from '../../services/comic.service';
import { filter, Subscription } from 'rxjs';
import { OwnedComic } from '../../models/comic.model';
import { Router, NavigationEnd } from '@angular/router';
import { Card } from '../../components/Card';

@Component({
  selector: 'app-my-comics',
  imports: [Card],
  templateUrl: './my-comics.component.html',
  styleUrl: './my-comics.component.scss',
})
export class MyComicsComponent implements OnInit, OnDestroy {
  private comicService = inject(ComicService);
  private router = inject(Router);
  protected myComics = signal<OwnedComic[]>([]);
  private routerSubscription?: Subscription;

  ngOnInit() {
    this.getComics();

    // Reload comics when navigating back to this route
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === '/' || this.router.url === '') {
          this.getComics();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private getComics() {
    this.comicService.getMyComics().subscribe({
      next: (data) => {
        console.log('My comics data:', data);
        this.myComics.set(data);
      },
      error: (error) => {
        console.error('Error loading comics: ', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }
}
