import * as React from 'react';
import { useParams } from 'react-router-dom';

const LiveReduction: React.FC = () => {
  const { instrumentName } = useParams<{ instrumentName: string }>();

  return (
    <div>
      <h1>
        {instrumentName
          ? `${instrumentName.toUpperCase()} Live Reduction Page`
          : 'Live Reduction Page'}
      </h1>
      <p>This is the live reduction page. Content will be added soon.</p>
    </div>
  );
};

export default LiveReduction;
