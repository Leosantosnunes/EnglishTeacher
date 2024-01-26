import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { HttpClientModule } from '@angular/common/http';
import { Chat } from '../models/chat';
import { Subject } from 'rxjs';
import { RestDataSourceService } from '../services/rest-data-source.service';

@Component({
  selector: 'app-voice-mode',
  standalone: true,
  imports: [CommonModule,IconsModule, MatBadgeModule, MatButtonModule, MatIconModule,HttpClientModule],
  templateUrl: './voice-mode.component.html',
  styleUrl: './voice-mode.component.scss',
  providers:[AudioService]
})
export class VoiceModeComponent implements OnInit {
  
  isRecording = false;
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;  
  
  chats?: { role?: string, content?: string, date?: Date }[];  

  constructor(private audioRecordingService: AudioService, private cd: ChangeDetectorRef){}

  ngOnInit() {
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      //this.audioURL = window.URL.createObjectURL(blob);
      //this.audioPlayer.nativeElement.src = this.audioURL;
      this.audioRecordingService.SendAudio(blob);
      this.cd.detectChanges();
    });
  }
  
  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording() {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
  } 

}
