import { Builder } from '@builder.io/react';
import MobileStoresLinks from './MobileStoresLinks';

Builder.registerComponent(MobileStoresLinks, {
  name: 'MobileStoresLinks',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Title 1',
      required: true
    },
    {
      name: 'body',
      type: 'string',
      defaultValue: 'Body 1',
      required: true
    },
  ]
});
