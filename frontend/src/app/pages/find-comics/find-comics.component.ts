import { Component, inject, signal } from '@angular/core';
import { ComicService } from '../../services/comic.service';
import { Comic } from '../../models/comic.model';
import { Card } from '../../components/Card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-find-comics',
  imports: [Card, FormsModule, CommonModule],
  templateUrl: './find-comics.component.html',
  styleUrl: './find-comics.component.scss',
})
export class FindComicsComponent {
  private comicsService = inject(ComicService);
  protected comics = signal<Comic[]>([]);

  searchType = '';
  searchTerm = '';

  onSubmit() {
    this.loadComics(this.searchType, this.searchTerm);
  }

  private loadComics(searchType: string, searchTerm: string) {
    this.comicsService.searchComics(searchType, searchTerm).subscribe({
      next: (data) => {
        this.comics.set(data as unknown as Comic[]);
      },
      error: (error) => console.error('Error loading comics searched: ', error),
    });
  }
}
