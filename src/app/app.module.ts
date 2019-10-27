import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule, Pipe, PipeTransform} from '@angular/core';

import {AppComponent} from './app.component';
import {DocumentFormComponent} from './document-form/document-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PdfContainerComponent} from './pdf-container/pdf-container.component';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    DocumentFormComponent,
    PdfContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


}
