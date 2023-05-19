import { SystemsPopup } from '../components/SystemsPopup';
import './storiesGlobals.css';
import { testSystems } from './sampledata/SampleData';

export default {
  title: 'Components/SystemsPopup',
  component: SystemsPopup
};

export const Default = () => {
  return <SystemsPopup systemsList={testSystems} />;
};
