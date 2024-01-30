import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { HttpClientModule } from '@angular/common/http';
import { Chat } from '../models/chat';
import { Subject, Subscription } from 'rxjs';
import { RestDataSourceService } from '../services/rest-data-source.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-voice-mode',
  standalone: true,
  imports: [CommonModule,IconsModule, MatBadgeModule, MatButtonModule, MatIconModule,HttpClientModule],
  templateUrl: './voice-mode.component.html',
  styleUrl: './voice-mode.component.scss',
  providers:[AudioService]
})
export class VoiceModeComponent implements OnInit {

  hideContent = false;
  isRecording = false;
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  chats?: { role?: string, content?: string,content_name?:string,audio_content?:string, date?: Date, audioURL?:string }[];
  private sub = Subscription.EMPTY

  constructor(private audioRecordingService: AudioService, private cd: ChangeDetectorRef, private chatService:ChatService){}

  ngOnInit() {
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.audioPlayer.nativeElement.src = this.audioURL!;
      this.chatService.SendAudio(blob);
      this.cd.detectChanges();
    });
    this.sub = this.chatService.chats$.subscribe({
      next: chat => {
        this.chats = chat;
        console.log(this.chats)
        this.chats.forEach(element => {
          if(element.audio_content){
            const audioURL = this.audioRecordingService.handleAudioContent(element.audio_content);
            element.audioURL = audioURL;
          }

          this.cd.detectChanges();
        });

      }
    })
  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
  }

  toggleContentVisibility() {
    this.hideContent = !this.hideContent;
  }

}
