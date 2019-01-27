import { Component, OnInit } from '@angular/core';

import { CognitiveService } from '../cognitive.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  keyPhrases;

  constructor(private cgService: CognitiveService) { }

  ngOnInit() {
    this.cgService.currentMessage.subscribe(message => 
      {
        this.keyPhrases = message;
        console.log(message);
      });
  }

}
