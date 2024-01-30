import { NgModule } from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
import { IconMicrophone, IconEye, IconEyeOff } from 'angular-tabler-icons/icons';


// Select some icons (use an object, not an array)
const icons = {
  IconMicrophone,
  IconEye,
  IconEyeOff
};

@NgModule({
  imports: [
    TablerIconsModule.pick(icons)
  ],
  exports: [
    TablerIconsModule
  ]
})
export class IconsModule { }
