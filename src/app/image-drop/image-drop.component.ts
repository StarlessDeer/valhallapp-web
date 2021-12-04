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
  public listKey: string[] = [];
  public isAntares: boolean = false;
  public boom : Image = new Image(null,"../assets/boom.gif");
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == "Escape") this.selectedImage=null;
    if (this.listKey.length>9) {
      this.listKey.shift();
    }
    this.listKey.push(event.key);
    if(this.listKey.length<10) return;
    var code: string[] = [ "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a" ];
    var checkIfAntares:boolean =true;
    for (let index = 0; index < 10; index++) {
      if(this.listKey[index]!=code[index])
        checkIfAntares=false;
    }
    if(checkIfAntares) {
      this.isAntares = true;
      var sound = "../assets/antares.mp3";
      sound && ( new Audio(sound) ).play()
    }
  }

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
      if (this.isAntares) {
        var newImage : ScrollImage = new ScrollImage(this.antaresList[Math.floor(Math.random()*this.antaresList.length)])
      } else {
        var newImage : ScrollImage = new ScrollImage(this.starlessList[Math.floor(Math.random()*this.starlessList.length)])
      }
      if (this.scrollList.length==20) {
        this.scrollList[idToReplace] = newImage;
      } else {
      this.scrollList.push(newImage);
      }
      idToReplace++;
      if(idToReplace>19)
        idToReplace=0;
    },1000);
  }

  onImageRightClick(event: MouseEvent, scrollItem : ScrollImage)  {
    console.log(scrollItem);
    scrollItem.image=this.boom;
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
  artist: Artist| null;
  imgUrl: string;

  constructor(artist:Artist | null, imgUrl:string) {
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
