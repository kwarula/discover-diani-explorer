import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { checkAuthHealth, repairAuthIssues, refreshSession, resetAuthState } from '@/utils/auth-repair';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Shield, AlertTriangle, CheckCircle, RefreshCw, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AuthDebugger: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'issues' | 'unknown'>('unknown');
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  
  // Run initial health check
  useEffect(() => {
    if (!isLoading && user) {
      handleCheckHealth();
    }
  }, [isLoading, user]);
  
  // Check session details
  useEffect(() => {
    const getSessionDetails = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionDetails(data.session);
    };
    
    if (user) {
      getSessionDetails();
    }
  }, [user]);
  
  const handleCheckHealth = async () => {
    try {
      setIsChecking(true);
      setHealthStatus('checking');
      
      const isHealthy = await checkAuthHealth();
      setHealthStatus(isHealthy ? 'healthy' : 'issues');
      
    } catch (error) {
      console.error('Health check error:', error);
      setHealthStatus('unknown');
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleRepair = async () => {
    try {
      setIsRepairing(true);
      const success = await repairAuthIssues();
      
      if (success) {
        setHealthStatus('healthy');
        // Force page refresh to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Repair error:', error);
      toast.error('Repair attempt failed');
    } finally {
      setIsRepairing(false);
    }
  };
  
  const handleRefreshToken = async () => {
    try {
      setIsRefreshing(true);
      await refreshSession();
      
      // Get updated session
      const { data } = await supabase.auth.getSession();
      setSessionDetails(data.session);
      
    } catch (error) {
      console.error('Token refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetAuthState();
      // Note: resetAuthState already handles the page reload
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Reset attempt failed');
      setIsResetting(false);
    }
  };
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Debugger
          </CardTitle>
          <CardDescription>Loading authentication data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Not logged in
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Debugger
          </CardTitle>
          <CardDescription>You must be logged in to use this tool</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 gap-4">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            This tool helps troubleshoot authentication issues for logged-in users.
            Please log in to use this diagnostic tool.
          </p>
          <div className="mt-4 text-center">
            <h3 className="text-base font-semibold mb-2">Login Issues?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you can't log in because the login button is stuck on loading,
              you can try resetting your authentication state completely.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Auth State
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Authentication State</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all authentication data stored in your browser.
                    Use this option if you're having issues logging in or if the login
                    button is stuck in a loading state.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    disabled={isResetting}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Resetting...
                      </>
                    ) : (
                      <>Reset</>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="default" onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentication Debugger
        </CardTitle>
        <CardDescription>
          Diagnose and fix common authentication issues
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Health Status */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Authentication Health</h3>
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
            {healthStatus === 'checking' && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span>Checking authentication state...</span>
              </>
            )}
            {healthStatus === 'healthy' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Authentication is healthy</span>
              </>
            )}
            {healthStatus === 'issues' && (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Issues detected with your authentication</span>
              </>
            )}
            {healthStatus === 'unknown' && (
              <>
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <span>Status unknown</span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCheckHealth}
              disabled={isChecking}
            >
              {isChecking && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Check Health
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRepair}
              disabled={isRepairing || healthStatus !== 'issues'}
            >
              {isRepairing && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Repair Issues
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshToken}
              disabled={isRefreshing || !user}
            >
              {isRefreshing && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Token
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Reset State
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Authentication State</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will completely reset your authentication and log you out.
                    You'll need to log in again. Use this as a last resort when other repair methods don't work.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    disabled={isResetting}
                    className="bg-destructive text-destructive-foreground"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Resetting...
                      </>
                    ) : (
                      <>Reset & Logout</>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Separator />
        
        {/* User Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">User Information</h3>
          <div className="grid gap-1 text-sm">
            <div className="grid grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">User ID:</span>
              <span className="col-span-2 break-all">{user.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span className="col-span-2">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">Email Verified:</span>
              <span className="col-span-2">{user.email_confirmed_at ? 'Yes' : 'No'}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">Auth Provider:</span>
              <span className="col-span-2">
                {user.app_metadata?.provider || 'email'}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Profile Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Profile Information</h3>
          {profile ? (
            <div className="grid gap-1 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Name:</span>
                <span className="col-span-2">{profile.full_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Role:</span>
                <span className="col-span-2">{profile.role}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Status:</span>
                <span className="col-span-2">{profile.status}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-amber-800 font-medium">Profile not found</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Your user profile is missing. This can cause limited functionality in the app.
                Click "Repair Issues" above to attempt to fix this problem.
              </p>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Session Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Session Information</h3>
          {sessionDetails ? (
            <div className="grid gap-1 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Session ID:</span>
                <span className="col-span-2 break-all">{sessionDetails.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-muted-foreground">Expires At:</span>
                <span className="col-span-2">
                  {new Date(sessionDetails.expires_at * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-amber-800 font-medium">No active session found</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Your session information is missing or invalid.
                Try refreshing your token or signing out and back in.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
        <Button variant="ghost" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthDebugger; 