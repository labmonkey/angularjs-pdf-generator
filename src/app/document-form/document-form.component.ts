import {Component, OnInit, ViewChild} from '@angular/core';
import {Sticker} from "../sticker";
import {DataService} from "../data.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {

  @ViewChild('documentForm', {static: false}) ngForm: NgForm;

  model = new Sticker("Glasses", 150, 20, 10);

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.currentModel.subscribe(model => this.model = model);
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  onSubmit() {
    this.dataService.changeModel(this.model);
  }
}
