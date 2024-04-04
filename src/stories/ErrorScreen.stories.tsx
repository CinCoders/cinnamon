import { ErrorScreen, httpErrors } from '../lib-components/ErrorScreen';
import { BrowserRouter } from 'react-router-dom';
import { Meta, StoryFn } from '@storybook/react';

export default {
  title: 'Components/ErrorScreen',
  component: ErrorScreen,
  argTypes: {
    errorType: {
      name: 'errorType',
      description: 'Type of error to be displayed',
      required: true,
      options: [
        httpErrors.NOTFOUND_404,
        httpErrors.COMINGSOON_501,
        httpErrors.INACTIVE_503,
        httpErrors.MAINTENANCE_503
      ],
      control: {
        type: 'radio',
        labels: {
          [httpErrors.NOTFOUND_404]: 'Not Found',
          [httpErrors.COMINGSOON_501]: 'Coming Soon',
          [httpErrors.INACTIVE_503]: 'Inactive',
          [httpErrors.MAINTENANCE_503]: 'Maintenance'
        }
      }
    }
  }
} as Meta;

interface ErrorScreenStoryProps {
  errorType: httpErrors;
}

const Template: StoryFn<ErrorScreenStoryProps> = (args) => {
  return (
    <BrowserRouter>
      <ErrorScreen errorType={args.errorType} />
    </BrowserRouter>
  );
};

export const NotFoundPage_ = Template.bind({});
NotFoundPage_.args = {
  errorType: httpErrors.NOTFOUND_404
};

export const ComingSoonPage_ = Template.bind({});
ComingSoonPage_.args = {
  errorType: httpErrors.COMINGSOON_501
};

export const InactivePage_ = Template.bind({});
InactivePage_.args = {
  errorType: httpErrors.INACTIVE_503
};

export const MaintenancePage_ = Template.bind({});
MaintenancePage_.args = {
  errorType: httpErrors.MAINTENANCE_503
};
