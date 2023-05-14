import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('videoElement')
  videoElement!: ElementRef;
  @ViewChild('canvasElement')
  canvasElement!: ElementRef;

  async ngAfterViewInit() {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  capture() {
    const canvas = this.canvasElement.nativeElement;
    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
  }
}
