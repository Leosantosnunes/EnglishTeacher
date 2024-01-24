import { Routes } from '@angular/router';
import { VoiceModeComponent } from './voice-mode/voice-mode.component';
import { TextModeComponent } from './text-mode/text-mode.component';


export const routes: Routes = [
    {path:'text', component: TextModeComponent},
    {path: 'voice', component: VoiceModeComponent},
];

export default routes;
