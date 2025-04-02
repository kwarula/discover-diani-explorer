import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const OperatorSubmissionConfirmation: React.FC = () => {
  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Application Submitted Successfully!</CardTitle>
          <CardDescription>Thank you for registering as an Operator.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our team will review your application and documents, typically within 24-48 business hours.
            You'll receive an email notification once the review is complete.
          </p>
          <p>
            In the meantime, you can access your Operator Dashboard to get familiar with the platform.
            Please note that your profile and listings will not be visible to the public until approved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/operator/dashboard">
            <Button>Go to My Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OperatorSubmissionConfirmation;
