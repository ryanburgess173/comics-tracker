import { Component, input, inject } from '@angular/core';
import { Comic } from '../models/comic.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  private router = inject(Router);
  comic = input.required<Comic>();

  clickHandler() {
    this.router.navigate(['/comic-detais'], { queryParams: { id: this.comic().id } });
  }
}
