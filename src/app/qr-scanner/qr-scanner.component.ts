import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';
import { debug } from 'util';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit, AfterViewInit {
  
  
  @ViewChild('scaningVideo', {static: false}) scaningVideo: ElementRef;

  @ViewChild('deviceList', {static: false}) deviceList: ElementRef;

  @ViewChild('qrCodeDisplay', {static: false}) qrCodeDisplay: ElementRef;

  codeReader: BrowserQRCodeReader;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.codeReader = new BrowserQRCodeReader();

    

    this.codeReader
      .listVideoInputDevices()
      .then(videoInputDevices => {
      videoInputDevices.forEach(device => {
          console.log(`${device.label}, ${device.deviceId}`);


          var opt = document.createElement('option');
          
          opt.text = device.label;
          opt.value = device.deviceId;
        
          this.deviceList.nativeElement.add(opt);

        }
      );
    })
    .catch(err => console.error(err));
  
  }

  startScan() {
      // window.alert(this.scaningVideo.nativeElement.outerHTML);

    var videoElement = this.scaningVideo.nativeElement;  
    var devId = this.deviceList.nativeElement.value;
    
    var cdReader = this.codeReader;

    var mediaConstrains = {
      audio: false,
      video: { width: 300, height: 300, deviceId: devId }
    };

    var qrDisplay = this.qrCodeDisplay;

    navigator.mediaDevices.getUserMedia(mediaConstrains)
      .then(function(stream) {
        videoElement.srcObject = stream;
        //videoElement.play();

        cdReader.decodeFromVideoElement(videoElement)
                .then(result => {
                  console.log(result.getText());

                  qrDisplay.nativeElement.innerHTML = result.getText();
                  cdReader.reset();
                })
                .catch(err => console.error(err));

      })
      .catch(function(err) {
          console.log("An error occurred: " + err);
      });  


      // this.codeReader
      //     .decodeFromInputVideoDevice(this.deviceList.nativeElement.value, this.scaningVideo.nativeElement)
      //     .then(result => {
      //         console.log(result.getText());
      //         this.codeReader.reset();
      //       }
      //     )
      //     .catch(err => console.error(err));
  }

  cancelScan() {
    this.qrCodeDisplay.nativeElement.innerHTML = "";
    this.codeReader.reset();

  }

}
