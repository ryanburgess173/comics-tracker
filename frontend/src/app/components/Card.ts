import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  title: string = 'Comic Title';
  // This component can be used to display comic book information in a card format
}
