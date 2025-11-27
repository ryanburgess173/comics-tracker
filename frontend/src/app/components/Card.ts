import { Component, input } from '@angular/core';
import { Comic } from '../models/comic.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  // This component can be used to display comic book information in a card format
  comic = input.required<Comic>();
}
