import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DocumentEvent} from './document-event';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject(new DocumentEvent());

  currentEvent = this.messageSource.asObservable();

  constructor() {
  }

  changeModel(event: DocumentEvent) {
    this.messageSource.next(event);
  }
}
