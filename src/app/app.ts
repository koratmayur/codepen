import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  model,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {  CustomLayoutComponent } from './custom-spliter/custom-spliter';
@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    NzButtonModule,
    NzFlexModule,
    NzSplitterModule,
    NzSwitchModule,
    NzDropDownModule,
    CustomLayoutComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'app';
}
