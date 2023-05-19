import { Meta, StoryFn } from '@storybook/react';
import { Dialog, DialogProps } from '../lib-components/Dialog';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

export default {
  title: 'Components/Dialog',
  component: Dialog,
  argTypes: {
    type: {
      options: ['information', 'alert', 'decision', 'confirmation'],
      control: { type: 'radio' }
    },
    visibility: {
      name: 'visibility',
      type: { name: 'boolean', required: false },
      description: 'Boolean which defines the visibility of the Dialog.',
      options: [true, false],
      control: { type: 'boolean' }
    }
  }
} as Meta;

const TemplateMessage: StoryFn<DialogProps> = (args) => {
  const [dialogVisibility, setDialogVisibility] = useState(
    args.visibility ?? false
  );

  useEffect(() => {
    setDialogVisibility(args.visibility ?? false);
  }, [args.visibility]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '45%',
        top: '50%'
      }}
    >
      <Button
        sx={{ bottom: '18px' }}
        onClick={() => setDialogVisibility(!dialogVisibility)}
      >
        Show Dialog
      </Button>
      <Dialog
        {...args}
        visibility={dialogVisibility}
        setVisibility={setDialogVisibility}
      />
    </div>
  );
};

const TemplateOption: StoryFn<DialogProps> = (args) => {
  const [dialogVisibility, setDialogVisibility] = useState(
    args.visibility ?? false
  );

  useEffect(() => {
    setDialogVisibility(args.visibility ?? false);
  }, [args.visibility]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '45%',
        top: '50%'
      }}
    >
      <Button
        sx={{ bottom: '18px' }}
        onClick={() => setDialogVisibility(!dialogVisibility)}
      >
        Show Dialog
      </Button>
      <Dialog
        {...args}
        visibility={dialogVisibility}
        rejectFunction={() => {
          setDialogVisibility(!dialogVisibility);
        }}
        acceptFunction={() => {
          setDialogVisibility(!dialogVisibility);
        }}
      />
    </div>
  );
};

export const DialogInformation = TemplateMessage.bind({});
DialogInformation.args = {
  type: 'information',
  title: 'Information Dialog Title',
  children:
    'DialogInformation appears in front of app content to provide additional information to the users.',
  acceptLabel: 'Confirmar'
};

export const DialogAlert = TemplateMessage.bind({});
DialogAlert.args = {
  type: 'alert',
  title: 'Alert Message Title',
  children:
    'DialogAlert is an option to display important information through an alert message, ensuring that the user is aware of a critical information.'
};

export const DialogDecision = TemplateOption.bind({});
DialogDecision.args = {
  type: 'decision',
  title: 'Decision Dialog Title',
  children:
    'DialogDecision presents a message to the user and includes a confirmation button and a cancel button, enabling the user to make a decision regarding a specific question.'
};

export const DialogConfirmation = TemplateOption.bind({});
DialogConfirmation.args = {
  type: 'confirmation',
  title: 'Confirmation Dialog Title',
  children:
    'DialogConfirmation presents a message to the user and includes a confirmation button and a cancel button, ensuring that the user acknowledges the message.'
};
