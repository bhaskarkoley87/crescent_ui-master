import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeSliderComponent implements OnInit {

  constructor(private _carouselConfig: NgbCarouselConfig) { 
    _carouselConfig.interval = 5000;
    _carouselConfig.wrap = true;
    _carouselConfig.keyboard = false;
    _carouselConfig.pauseOnHover = false;
  }

  ngOnInit() {
  }

}
