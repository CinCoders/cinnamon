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
  console.log('args.visibility', args.visibility);

  const [dialogVisibility, setDialogVisibility] = useState(
    args.visibility == undefined ? false : args.visibility
  );

  useEffect(() => {
    setDialogVisibility(args.visibility == undefined ? false : args.visibility);
  }, [args.visibility]);

  return (
    <>
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
    </>
  );
};

const TemplateOption: StoryFn<DialogProps> = (args) => {
  console.log('args.visibility', args.visibility);

  const [dialogVisibility, setDialogVisibility] = useState(
    args.visibility == undefined ? false : args.visibility
  );

  useEffect(() => {
    setDialogVisibility(args.visibility == undefined ? false : args.visibility);
  }, [args.visibility]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '45%',
          top: '50%'
        }}
      >
        <Button
          sx={{ bottom: '15px' }}
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
    </>
  );
};

export const DialogInformation = TemplateMessage.bind({});
DialogInformation.args = {
  type: 'information',
  title: 'Information Dialog Title',
  children:
    'Nesta tela é possível tanto criar um tipo de processo ao usar o botão “+”, como é possível editar um tipo de processo ao buscar um pelo nome usando o botão de lupa.',
  acceptLabel: 'Confirmar',
  visibility: false
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
  title: 'Tipo de processo já existente',
  children:
    'Você está tentando adicionar um tipo de processo que já existe. Deseja carregar o Tipo de Processo ‘Convênio’ já existente?'
};

export const DialogConfirmation = TemplateOption.bind({});
DialogConfirmation.args = {
  type: 'confirmation',
  title: 'Você deseja criar o tipo de processo?',
  children:
    'Deseja realmente criar esse tipo de processo? Aperte em ‘Ok’ se deseja criar, ou em ‘Cancelar’ se deseja confirmar os dados.'
};
