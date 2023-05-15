import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Metadata {
  downloadURLs: string[];
  // Agrega otras propiedades que necesites del objeto metadata
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  user$!: Observable<firebase.default.User | null>;
  images: string[] = [];
  // downloadURL!: Observable<string>;

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.user$ = this.afAuth.authState;
  }

  async login() {
    await this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }
  async logout() {
    await this.afAuth.signOut();
  }

// async uploadImage() {
//   debugger;
//   const canvas = this.canvasElement.nativeElement;
//   const dataUrl = canvas.toDataURL('image/jpeg');
//   const blob = this.dataURLtoBlob(dataUrl);
//   console.log('Objeto Blob:', blob);
//   const filePath = `images/${new Date().getTime()}.jpeg`;
//   const fileRef = this.storage.ref(filePath);
//   const task = this.storage.upload(filePath, blob);
  
//   task.snapshotChanges().pipe(
//     last(),
//     switchMap(() => fileRef.getDownloadURL())
//   ).subscribe(url => console.log('download url:', url))

//   // task.then(async (snapshot: firebase.default.storage.UploadTaskSnapshot) => {
//   //   const downloadURL = await fileRef.getDownloadURL();
//   //   this.images.push(downloadURL.toString()); // Convertir el objeto en una cadena de texto
//   //   console.log('URL de la imagen:', downloadURL.toString());
//   // });
// }
async uploadImage() {
  const canvas = this.canvasElement.nativeElement;
  const dataUrl = canvas.toDataURL('image/jpeg');
  const blob = this.dataURLtoBlob(dataUrl);
  console.log('Objeto Blob:', blob);
  const filePath = `images/${new Date().getTime()}.jpeg`;
  const fileRef = this.storage.ref(filePath);
  const task = this.storage.upload(filePath, blob);

  try {
    await task;
    fileRef.getDownloadURL().subscribe(downloadURL => {
      console.log('URL de la imagen:', downloadURL);
      this.images.push(downloadURL);
    }, error => {
      console.error(error);
    });
  } catch (error) {
    console.error(error);
  }
}











  

  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }
  
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
function last(): import("rxjs").OperatorFunction<import("firebase/compat").default.storage.UploadTaskSnapshot | undefined, unknown> {
  throw new Error('Function not implemented.');
}

function switchMap(arg0: () => Observable<any>): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

