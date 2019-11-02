import {Sticker} from './sticker';

export class DocumentEvent {
  includeBorders: boolean;
  items: Array<Sticker>;

  constructor() {
    this.includeBorders = false;
    this.items = [];
  }
}
