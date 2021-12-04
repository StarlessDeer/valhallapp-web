import { Component, HostListener, OnInit } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';

import imageData from '../imageUrl.json';

@Component({
  selector: 'app-image-drop',
  templateUrl: './image-drop.component.html',
  styleUrls: ['./image-drop.component.css']
})

export class ImageDropComponent implements OnInit {
  public artistList:Artist[] = [];
  public starlessList:Image[] = [];
  public antaresList:Image[] = [];
  public scrollList:ScrollImage[] = [];
  public selectedImage: Image| undefined | null;
  public positionOptions: TooltipPosition="below";
  @HostListener("window:resize", [])
  ngOnInit() {
    // intit all the artists
    imageData.artistList.forEach(artist =>
      this.artistList.push(new Artist(artist.name,artist.imgUrl,artist.twitterUrl))
    );
    // intit all the starless img
    imageData.starlessUrl.forEach(image =>
      this.starlessList.push(new Image(this.artistList[image.credit],image.url))
    );
    // init all the antares img
    imageData.antaresUrl.forEach(image =>
      this.antaresList.push(new Image(this.artistList[image.credit],image.url))
    );
    var idToReplace:number = 0;
    // will push the data
    window.setInterval(() => {
      // will add the image to the list
      if (this.scrollList.length==20) {
        this.scrollList[idToReplace] = new ScrollImage(this.starlessList[Math.floor(Math.random()*this.starlessList.length)]);
      } else {
      this.scrollList.push(new ScrollImage(this.starlessList[Math.floor(Math.random()*this.starlessList.length)]));
      }
      idToReplace++;
      if(idToReplace>19)
        idToReplace=0;
    },1000);
  }

  OpenLink(link : string | null) {
    if (link!= null)
      window.open(link, "_blank");
  }

  ClearSelectedImage() {
    this.selectedImage=null;
  }

  isMobile():boolean {
    var width = window.innerWidth;
    if ( width < 600) {
      return true;
    } else {
      return false;
    };
  }

}

class Artist {
  name: string;
  imgUrl: string | null;
  twitterUrl: string | null;

  constructor(name:string, imgUrl:string | null, twitterUrl:string | null) {
    this.name=name;
    this.imgUrl=imgUrl;
    this.twitterUrl=twitterUrl;
  }
}

class Image {
  artist: Artist;
  imgUrl: string;

  constructor(artist:Artist, imgUrl:string) {
    this.artist=artist;
    this.imgUrl=imgUrl;
  }
}

class ScrollImage {
  image: Image;
  margin: string;
  constructor(image:Image) {
    this.image=image;
    this.margin = Math.floor(Math.random()*80) + "%";
  }
}
