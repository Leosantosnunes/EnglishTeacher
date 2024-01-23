import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-mode.component.html',
  styleUrl: './voice-mode.component.scss'
})
export class VoiceModeComponent implements OnInit {
  
  isRecording = false;
  audioURL: string | null = null;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private audioRecordingService: AudioService, private cd: ChangeDetectorRef){}

  ngOnInit() {
    this.audioRecordingService.audioBlob$.subscribe(blob => {
      this.audioURL = window.URL.createObjectURL(blob);
      this.audioPlayer.nativeElement.src = this.audioURL;
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
