import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestDataSourceService } from '../services/rest-data-source.service';
import { Chat } from '../models/chat';
import { Subject, Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TextService } from '../services/text.service';

@Component({
  selector: 'app-text-mode',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule],
  templateUrl: './text-mode.component.html',
  styleUrl: './text-mode.component.scss',
  providers:[TextService]
})
export class TextModeComponent implements OnInit {
  
  newText?: Chat = {chat:{role:'',content:''}}
  public textAreaValue: String = '';
  chats?: { role?: string, content?: string, date?: Date }[];
  private sub = Subscription.EMPTY
  

  constructor(private textService: TextService){}  

  ngOnInit(): void {
    this.sub = this.textService.chats$.subscribe({
      next: chat => {this.chats = chat; console.log(this.chats)}
    })
  }
  
  onSendButtonClick(): void {
       
    this.newText!.chat!.role = 'user';
    this.newText!.chat!.content = this.textAreaValue;
    this.textService.textChat(this.newText)
    this.textAreaValue = '';   
  }

  
}
