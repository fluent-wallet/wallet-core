import React from 'react';
import { createComponent } from '@lit/react';
import { InitializePassword as InitializePasswordWC } from 'common-web/dist';

export const InitializePassword = createComponent({
  react: React,
  tagName: 'initialize-password',
  elementClass: InitializePasswordWC,
  events: {
    onClickBackButton: 'onClickBackButton',
    onClickRevealButton: 'onClickRevealButton',
  },
});
