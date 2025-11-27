import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Comic } from '../../models/comic.model';
import { ComicService } from '../../services/comic.service';
import { Card } from '../../components/Card';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [Card],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private comicsService = inject(ComicService);
  private router = inject(Router);
  protected comics = signal<Comic[]>([]);
  private routerSubscription?: Subscription;

  ngOnInit() {
    this.loadComics();

    // Reload comics when navigating back to this route
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === '/' || this.router.url === '') {
          this.loadComics();
        }
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private loadComics() {
    this.comicsService.getRecentReleases().subscribe({
      next: (data) => {
        this.comics.set(data as unknown as Comic[]);
      },
      error: (error) => console.error('Error loading comics:', error),
    });
  }
}
