import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';

const SubmissionConfirmationPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center bg-green-50 pb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl text-green-700">Application Submitted Successfully!</CardTitle>
          <CardDescription className="text-lg text-green-600">
            Your operator application has been received
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-6 md:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">What happens next?</h3>
              <p className="text-gray-600">
                Our team will review your application and verification documents. This typically takes 1-3 business days.
                You'll receive an email notification once the review is complete.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">During the review period:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>You can log in to your account at any time</li>
                <li>You'll have limited access to the operator dashboard</li>
                <li>You can update your profile information if needed</li>
                <li>Our team may contact you if additional information is required</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-xl font-medium mb-2 text-blue-700">Need assistance?</h3>
              <p className="text-blue-600">
                If you have any questions about your application or account, please don't hesitate to contact our support team.
              </p>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a href="mailto:support@discoverdiani.com" className="flex items-center space-x-2">
                    <span>Contact Support</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 gap-4">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="default" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmissionConfirmationPage; 