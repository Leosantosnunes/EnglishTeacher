import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatFormFieldModule} from '@angular/material/form-field'
import { RestDataSourceService } from './services/rest-data-source.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { TextModeComponent } from './text-mode/text-mode.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatSidenavModule,MatFormFieldModule,HttpClientModule,TextModeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[RestDataSourceService]
})
export class AppComponent implements OnInit, OnDestroy {
  
  chats?: { role?: string, content?: string, date?: Date }[];
  private chatsSubject = new Subject<{ role?: string, content?: string, date?: Date }[]>();
  chats$ = this.chatsSubject.asObservable();
  body: String = '';  
  private subscription = Subscription.EMPTY;
  id:String = ''
  dateId?:Date[];
  

  constructor(private dataSource:RestDataSourceService){}

  ngOnInit(): void {
    // this.subscription = this.dataSource.getId(this.body).subscribe((t)=>{
    // this.id = t.id;
    // console.log(this.id);
    // })
    this.dataSource.getChat().subscribe((response)=>{
      this.dateId = response
      .map((item: { chat: any[]; }) => item.chat.map(chatItem => new Date(chatItem.timestamp)))
      .flat();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  retrieveDataonClick(item:any): void{
    this.dataSource.getByDate(item).subscribe((response:any) =>{
      console.log(response)
      this.chats = response.chat;
      this.chats?.shift();
      this.chatsSubject.next(this.chats!);
      console.log(this.chats)
    },
    (error)=>{
      console.error('Error', error);
    });
  }
}
