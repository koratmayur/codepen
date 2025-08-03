
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-custom-layout',
  standalone: true,
  imports: [
    FormsModule,
    NzTabsModule,
    NzCodeEditorModule,
    NzSplitterModule,
    NzDropDownModule,
  ],
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.css'],
})
export class CustomLayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('horizontalSpliter')
  horizontalSpliter!: ElementRef<HTMLDivElement>;
  @ViewChild('verticalSpliter') verticalSpliter!: ElementRef<HTMLDivElement>;
  @ViewChild('buttonSvg') buttonSvg!: ElementRef<HTMLButtonElement>;
  @ViewChild('ifream') myIframe!: ElementRef<HTMLIFrameElement>;

  direction: string = 'column';
  childComponentHtml: any;

  htmlCode: string = `<div>Hello, world!</div>`;
  jsCode: string = `console.log('Hello, world!');`;
  cssCode: string = `div { color: blue; }`;

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private startLeftWidth = 0;
  private startRightWidth = 0;
  private startLeftHeight = 0;
  private startRightHeight = 0;
  private currentDraggingElement = '';
  private currentDraggingHeader: HTMLElement | null = null;

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.verticalSpliter?.nativeElement.addEventListener(
      'mousedown',
      this.onVerticalMouseDown
    );
    document.querySelectorAll('.horizontal-spliter').forEach((el: any) => {
      el.addEventListener('mousedown', this.onHorizontalMouseDown);
    });
  }

  ngOnDestroy() {
    this.verticalSpliter?.nativeElement.removeEventListener(
      'mousedown',
      this.onVerticalMouseDown
    );
    document.querySelectorAll('.horizontal-spliter').forEach((el: any) => {
      el.removeEventListener('mousedown', this.onHorizontalMouseDown);
    });
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onVerticalMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    this.isDragging = true;
    this.currentDraggingElement = 'vertical';
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.disableIframePointerEvents();

    const leftSide = document.querySelector('.left-side') as HTMLElement;
    const rightSide = document.querySelector('.right-side') as HTMLElement;

    if (leftSide && rightSide) {
      this.startLeftWidth = leftSide.offsetWidth;
      this.startRightWidth = rightSide.offsetWidth;
      this.startLeftHeight = leftSide.offsetHeight;
      this.startRightHeight = rightSide.offsetHeight;
    }

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  onHorizontalMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    this.isDragging = true;
    this.currentDraggingElement = 'horizontal';
    this.startY = event.clientY;

    const target = event.target as HTMLElement;
    this.currentDraggingHeader = target.closest('.code-editer') as HTMLElement;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseMove = (event: MouseEvent) => {
    if (!this.isDragging) return;

    if (this.currentDraggingElement === 'vertical') {
      this.handleVerticalMouseMove(event);
    } else if (this.currentDraggingElement === 'horizontal') {
      this.handleHorizontalMouseMove(event);
    }
  };

  onMouseUp = () => {
    this.isDragging = false;
    this.currentDraggingElement = '';
    this.currentDraggingHeader = null;
    this.enableIframePointerEvents();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  handleVerticalMouseMove(event: MouseEvent) {
    const leftSide = document.querySelector('.left-side') as HTMLElement;
    const rightSide = document.querySelector('.right-side') as HTMLElement;

    if (!leftSide || !rightSide) return;

    if (this.direction !== 'column' && this.direction !== 'column-reverse') {
      const deltaX = event.clientX - this.startX;
      let newLeftWidth = this.startLeftWidth + deltaX;
      let newRightWidth = this.startRightWidth - deltaX;
      const minWidth = 200;
      const totalWidth = this.startLeftWidth + this.startRightWidth;

      if (newLeftWidth < minWidth) {
        newLeftWidth = minWidth;
        newRightWidth = totalWidth - minWidth;
      } else if (newRightWidth < minWidth) {
        newRightWidth = minWidth;
        newLeftWidth = totalWidth - minWidth;
      }

      leftSide.style.width = `${newLeftWidth}px`;
      rightSide.style.width = `${newRightWidth}px`;
    } else {
      const deltaY = event.clientY - this.startY;
      let newLeftHeight = this.startLeftHeight + deltaY;
      let newRightHeight = this.startRightHeight - deltaY;
      const minHeight = 100;
      const totalHeight = this.startLeftHeight + this.startRightHeight;

      if (newLeftHeight < minHeight) {
        newLeftHeight = minHeight;
        newRightHeight = totalHeight - minHeight;
      } else if (newRightHeight < minHeight) {
        newRightHeight = minHeight;
        newLeftHeight = totalHeight - minHeight;
      }

      leftSide.style.height = `${newLeftHeight}px`;
      rightSide.style.height = `${newRightHeight}px`;
    }
  }

  handleHorizontalMouseMove(event: MouseEvent) {
    if (!this.currentDraggingHeader) return;

    const prev = this.currentDraggingHeader
      .previousElementSibling as HTMLElement;
    const next = this.currentDraggingHeader.nextElementSibling as HTMLElement;
    const deltaY = event.clientY;

    if (prev && next) {
      const totalHeight = prev.offsetHeight + next.offsetHeight;
      const newPrevHeight = deltaY - prev.getBoundingClientRect().top;
      const newNextHeight = totalHeight - newPrevHeight;

      if (newPrevHeight > 50 && newNextHeight > 50) {
        prev.style.height = `${newPrevHeight}px`;
        next.style.height = `${newNextHeight}px`;
      }
    }
  }

  ngAfterViewChecked(): void {
    this.childComponentHtml = `<html>
      <head><style>${this.cssCode}</style></head>
      <body>
        ${this.htmlCode}
        <script>${this.jsCode}<\/script>
      </body>
    </html>`;
    this.loadChildHtmlInIframe();
  }

  loadChildHtmlInIframe(): void {
    const iframe = this.myIframe.nativeElement;
    const iframeDoc = iframe.contentDocument;

    if (iframeDoc) {
      const sanitized: SafeHtml | any = this.sanitizer.bypassSecurityTrustHtml(
        this.childComponentHtml
      );
      iframeDoc.open();
      iframeDoc.write(sanitized['changingThisBreaksApplicationSecurity']);
      iframeDoc.close();
    } else {
      console.error('Could not access iframe document.');
    }
  }

  changeDirection(direction: string) {
    this.direction = direction;

    const deg =
      direction === 'row-reverse' ? '-90' : direction === 'row' ? '90' : '0';

    this.buttonSvg.nativeElement.style.transition = 'all 0.25s';
    this.buttonSvg.nativeElement.style.rotate = `${deg}deg`;
    document.body.style.setProperty('--direction', direction);

    setTimeout(() => {
      this.verticalSpliter?.nativeElement.addEventListener(
        'mousedown',
        this.onVerticalMouseDown
      );
      document.querySelectorAll('.horizontal-spliter').forEach((el: any) => {
        el.addEventListener('mousedown', this.onHorizontalMouseDown);
      });
    }, 1000);
    this.cd.detectChanges();
  }
  disableIframePointerEvents() {
    if (this.myIframe?.nativeElement) {
      this.myIframe.nativeElement.style.pointerEvents = 'none';
    }
  }

  enableIframePointerEvents() {
    if (this.myIframe?.nativeElement) {
      this.myIframe.nativeElement.style.pointerEvents = 'auto';
    }
  }
}
