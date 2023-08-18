import * as React from 'react';
import { useParams } from 'react-router-dom';

const ReductionHistory: React.FC = () => {
  const { instrumentName } = useParams<{ instrumentName: string }>();

  return (
    <div>
      <h1>
        {instrumentName
          ? `${instrumentName.toUpperCase()} Reduction History Page`
          : 'Reduction History Page'}
      </h1>
      <p>This is the reduction history page. Content will be added soon.</p>
    </div>
  );
};

export default ReductionHistory;
