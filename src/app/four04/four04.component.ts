import { Component, OnInit } from '@angular/core';
import { shuffle } from "lodash";

export interface IGallery {
  title: string;
  imagePath: string;
  text: string;
};

@Component({
  selector: 'lasp-four04',
  templateUrl: './four04.component.html',
  styleUrls: ['./four04.component.scss']
})
export class Four04Component implements OnInit {
  gallery: IGallery[];

  constructor() {
    this.gallery = [
      {
        title : "Not Found",
        imagePath : "assets/images/404/hubble1.jpg",
        text : "Sorry, the page you're looking for seems to be lost in space."
      },
      {
        title : "Hmm…",
        imagePath : "assets/images/404/andromeda.jpg",
        text : "Out of all the pages in the galaxy, we couldn't find that one. "
      },
      {
        title : "Not Found",
        imagePath : "assets/images/404/UGC_Cluster.jpg",
        text : "Sorry, the page you're looking for seems to be lost in space."
      }
    ];
  }

  ngOnInit() {
    this.gallery = shuffle(this.gallery);
  }

}
