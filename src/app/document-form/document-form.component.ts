import {Component, OnInit} from '@angular/core';
import {Sticker} from '../sticker';
import {DataService} from '../data.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocumentEvent} from '../document-event';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  stickerForm: FormGroup;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.stickerForm = this.formBuilder.group({
      includeBorders: new FormControl(false),
      items: this.formBuilder.array([this.createItem()])
    });
  }

  // convenience getters for easy access to form fields
  get controls() {
    return this.stickerForm.controls;
  }

  get items() {
    return this.controls.items as FormArray;
  }

  createItem(): FormGroup {
    return this.formBuilder.group(new Sticker(null, null, null, null));
    //return this.formBuilder.group(new Sticker('test', 9999.99, 0, 10));
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // get diagnostic() {
  //   return JSON.stringify(this.model);
  // }

  onSubmit() {
    const event: DocumentEvent = {
      includeBorders: this.controls.includeBorders.value,
      items: this.items.value
    };

    this.dataService.changeModel(event);
  }
}
