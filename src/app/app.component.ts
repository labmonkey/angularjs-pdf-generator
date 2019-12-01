import {Component, OnInit} from '@angular/core';
import {versionInfo} from './version-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pdf-generator';

  ngOnInit(): void {
  }

  getVersion(): string {
    return versionInfo.date + '-' + versionInfo.hash;
  }
}
