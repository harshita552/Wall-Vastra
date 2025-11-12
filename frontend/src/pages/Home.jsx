// src/pages/Home.jsx
import CollageLayoutSelector from '../components/CollageLayoutSelector/CollageLayoutSelector';
import FrameTypeSelection from './FrameTypeSelection';
import ServiceSelection from './ServiceSelection';

const Home = ({ onSelectLayout }) => (
  <div className="p-0">
    {/* <h1 className="text-2xl font-bold mb-4">Choose a Collage Layout</h1> */}
    <CollageLayoutSelector onSelectLayout={onSelectLayout} />
    <FrameTypeSelection/>
    <ServiceSelection/>
  </div>
);

export default Home;
