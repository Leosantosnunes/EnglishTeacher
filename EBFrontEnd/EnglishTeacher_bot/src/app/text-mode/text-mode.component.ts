import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RestDataSourceService } from '../services/rest-data-source.service';
import { Chat } from '../models/chat';
import { Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-mode',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule],
  templateUrl: './text-mode.component.html',
  styleUrl: './text-mode.component.scss'
})
export class TextModeComponent {
  
  newText?: Chat = {chat:{role:'',content:''}}
  public textAreaValue: String = '';
  chats?: { role?: string, content?: string, date?: Date }[];
  private chatsSubject = new Subject<{ role?: string, content?: string, date?: Date }[]>();
  chats$ = this.chatsSubject.asObservable();

  constructor(private dataSource:RestDataSourceService){}  
  
  onSendButtonClick(): void {    
    
    this.newText!.chat!.role = 'user';
    this.newText!.chat!.content = this.textAreaValue;
    this.dataSource.chat(this.newText).subscribe((response: any) => {      
      this.chats = response.chat;
      console.log(this.chats);
      this.chats?.shift(); 
      this.chatsSubject.next(this.chats!);     
    },
    (error) => {
      console.error('Error', error);
    });
    this.textAreaValue = '';   
  }
}
