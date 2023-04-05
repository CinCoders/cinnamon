import { Meta, Story } from '@storybook/react';
import { Dialog, DialogProps } from '../lib-components/Dialog';

export default {
  title: 'Dialog',
  component: Dialog,
  argTypes: {
    type: {
      options: ['information', 'alert', 'decision', 'confirmation'],
      control: { type: 'radio' }
    }
  }
} as Meta;

const Template: Story<DialogProps> = (args) => <Dialog {...args} />;

export const DialogInformation = Template.bind({});
DialogInformation.args = {
  type: 'information',
  title: 'Tela de criação e edição de tipo de processo',
  children:
    'Nesta tela é possível tanto criar um tipo de processo ao usar o botão “+”, como é possível editar um tipo de processo ao buscar um pelo nome usando o botão de lupa.',
  acceptLabel: 'Confirmar',
  setVisibility: () => {}
};

export const DialogAlert = Template.bind({});
DialogAlert.args = {
  type: 'alert',
  title: 'Tipo de processo não existente',
  children:
    'Você está buscando um tipo de processo não existente. Por favor, verifique o nome e tente novamente.',
  setVisibility: () => {}
};

export const DialogDecision = Template.bind({});
DialogDecision.args = {
  type: 'decision',
  title: 'Tipo de processo já existente',
  children:
    'Você está tentando adicionar um tipo de processo que já existe. Deseja carregar o Tipo de Processo ‘Convênio’ já existente?',
  setVisibility: () => {}
};

export const DialogConfirmation = Template.bind({});
DialogConfirmation.args = {
  type: 'confirmation',
  title: 'Você deseja criar o tipo de processo?',
  children:
    'Deseja realmente criar esse tipo de processo? Aperte em ‘Ok’ se deseja criar, ou em ‘Cancelar’ se deseja confirmar os dados.',
  setVisibility: () => {}
};
