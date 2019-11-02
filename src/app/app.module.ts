import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule, Pipe, PipeTransform} from '@angular/core';

import {AppComponent} from './app.component';
import {DocumentFormComponent} from './document-form/document-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PdfContainerComponent} from './pdf-container/pdf-container.component';
import { NumericDirective } from './numeric.directive';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    SafePipe,
    DocumentFormComponent,
    PdfContainerComponent,
    NumericDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
