import {ApiService} from './api.service'
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import * as xml2js from 'xml2js';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  ,styleUrls: ['./app.component.css'],
  animations:[
    trigger('fade',
    [
      state('void', style({ opacity : 0})),
      transition(':enter',[ animate(300)]),
      transition(':leave',[ animate(500)]),
    ]
)]
})
export class AppComponent {
  title = 'myNewApp';
  rssData: any;
  rssChannel: any;
  rssItems: any;
  rssDate:any;
  parser: any = new xml2js.Parser({ strict: false, trim: true });

  constructor(private api:ApiService, private translate:TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en')
  }
  goToLink(link: any)
  {
    window.open(link, '_blank')
  }
  ngOnInit(){
    this.api.getRssData().subscribe((data: any) =>
    {
      this.parser.parseString(data, (err:any , result: any) => {
        this.rssData = result.RSS;
        this.rssItems = this.rssData.CHANNEL[0].ITEM
        this.rssChannel = result.RSS.CHANNEL[0]
        this.rssDate = new Date(this.rssChannel.PUBDATE)
        this.rssItems.forEach((val:any) => {
          if (val["MEDIA:CONTENT"] !== undefined)
          {
            val.imgURL = val["MEDIA:CONTENT"][0].$.URL;
          }
          console.log(val.imgURL)
        val.URL = val["ATOM:LINK"][0].$.HREF});
      });

    });
  }
}
