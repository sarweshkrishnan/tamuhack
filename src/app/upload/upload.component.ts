import { Component, OnInit } from '@angular/core';

import { CognitiveService } from '../cognitive.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  url: string;
  selectedFile: File;

  constructor(private cgService: CognitiveService) { }

  onFileUpload(event:any) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        this.selectedFile = event.target.files[0];
        reader.readAsDataURL(this.selectedFile);

        reader.onload = (event:any) => {
            this.url = event.target.result;
        }

        let formData = new FormData();
        formData.append('image', this.selectedFile);

        this.cgService.getKeyPhrases(formData);
    }
}

}
