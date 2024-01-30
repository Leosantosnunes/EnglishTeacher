import { Chat } from './../models/chat';
import { Injectable } from '@angular/core';
import { RestDataSourceService } from './rest-data-source.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chats?: { role?: string, content?: string, date?: Date }[];
  private chatsSubject = new Subject<{ role?: string, content?: string, date?: Date }[]>();
  chats$ = this.chatsSubject.asObservable();

  constructor(private dataSource: RestDataSourceService) { }

  textChat(newText:any){
    this.dataSource.chat(newText).subscribe({
      next:(response) => {
      this.chats = (response.chat as { role?: string; content?: string; date?: Date }[]) || [];
      console.log(this.chats);
      this.chats?.shift();
      this.chatsSubject.next(this.chats!);
    },
    error: (err) => {
      console.error('Error', err)
    }});
  }


  getDataByDate(item: any) {
    this.dataSource.getByDate(item).subscribe({
      next: (response) => {
        // this.chats = response.chat;
        // this.chats?.shift();
        const chat = response.chat;
        chat.shift();
        this.chatsSubject.next(chat);
      },
      error: (err) => console.error('Error', err)
    });
  }

  SendAudio(blob:any){
    const formData = new FormData();
    const audioName : Date = new Date();
    const path: string = audioName.toLocaleString().replace(/[\/\s,:.]/g, ' ') + '.wav';
    formData.append('recording',blob,path);
    this.dataSource.voice(formData).subscribe({
      next:(response) => {
        const chat = response.chat;
        chat.shift();
        this.chatsSubject.next(chat);
        console.log('Observable updated:', this.chats$);
    },
    error: (err) => {
      console.error('Error', err)
    }});
  }


}
