import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../models/chat';
import { Subject, Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-text-mode',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, HttpClientModule],
  templateUrl: './text-mode.component.html',
  styleUrl: './text-mode.component.scss',
  providers:[]
})
export class TextModeComponent implements OnInit, OnDestroy {

  newText?: Chat = {chat:{role:'',content:''}}
  public textAreaValue: String = '';
  chats?: { role?: string, content?: string, date?: Date }[];
  private sub = Subscription.EMPTY


  constructor(private chatService: ChatService){}

  ngOnInit(): void {
    this.sub = this.chatService.chats$.subscribe({
      next: chat => {this.chats = chat; console.log(chat)}
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSendButtonClick(): void {

    this.newText!.chat!.role = 'user';
    this.newText!.chat!.content = this.textAreaValue;
    this.chatService.textChat(this.newText)
    this.textAreaValue = '';
  }


}
