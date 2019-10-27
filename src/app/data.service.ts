import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Sticker} from "./sticker";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject(new Sticker(null, null, null, null));

  currentModel = this.messageSource.asObservable();

  constructor() {
  }

  changeModel(model: Sticker) {
    this.messageSource.next(model)
  }
}
