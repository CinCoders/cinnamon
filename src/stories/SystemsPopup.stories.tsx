import { storiesOf } from '@storybook/react';
import { SystemsPopup } from '../components/SystemsPopup';
import './storiesGlobals.css';
import { testSystems } from './sampledata/SampleData';

const stories = storiesOf('SystemsPopup', module);

stories.add('SystemsPopup', () => {
  return <SystemsPopup systemsList={testSystems} />;
});
