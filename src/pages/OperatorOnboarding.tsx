import React from 'react';
import OperatorOnboardingForm from '@/components/forms/OperatorOnboardingForm'; // Import the form

const OperatorOnboarding: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Remove the outer border/shadow div, as the Card in the form provides structure */}
      <div className="max-w-3xl mx-auto"> {/* Increased max-width for better form layout */}
        <OperatorOnboardingForm />
      </div>
    </div>
  );
};

export default OperatorOnboarding;
