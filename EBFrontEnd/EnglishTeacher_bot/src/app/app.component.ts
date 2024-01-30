import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatFormFieldModule} from '@angular/material/form-field'
import { RestDataSourceService } from './services/rest-data-source.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ChatService } from './services/chat.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatSidenavModule,MatFormFieldModule,HttpClientModule,MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[RestDataSourceService, ChatService]
})
export class AppComponent implements OnInit, OnDestroy {

  chats?: { role?: string, content?: string, date?: Date }[];
  body: String = '';
  private subscription = Subscription.EMPTY;
  id:String = ''
  dateId?:Date[];
  isVoiceModeOn = false;


  constructor(private dataSource:RestDataSourceService, private chatService:ChatService, private router:Router){}

  ngOnInit(): void {
    this.subscription = this.dataSource.getId(this.body).subscribe((t)=>{
    this.id = t.id;
    console.log(this.id);
    })
    this.dataSource.getChat().subscribe((response)=>{
      this.dateId = response
      .map((item: { chat: any[]; }) => new Date(item.chat[0].timestamp) );
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  retrieveDataonClick(item:any): void{
    this.chatService.getDataByDate(item);
  }

  toggleVoiceMode() {
    // Toggle the state of the voice mode
    this.isVoiceModeOn = !this.isVoiceModeOn;

    // Navigate to the appropriate route based on the voice mode state
    if (this.isVoiceModeOn) {
      this.router.navigate(['/voice']);
    } else {
      this.router.navigate(['/text']);
    }
  }
}
