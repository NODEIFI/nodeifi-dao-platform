import { useState } from 'react';
import { UnifiedButton } from './ui/unified-button';

interface GoogleAuthProps {
  onSuccess: (user: any) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
}

export const GoogleAuth = ({ 
  onSuccess, 
  onError, 
  buttonText = "Sign in with Google",
  className = ""
}: GoogleAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    
    // Create OAuth URL that opens in new window (not iframe)
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const state = encodeURIComponent(crypto.randomUUID());
    
    const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    
    // Open in new window to avoid iframe restrictions
    const authWindow = window.open(
      authUrl,
      'google_oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Monitor the popup window
    const checkClosed = setInterval(() => {
      if (authWindow?.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
        
        // Check if authentication succeeded
        checkAuthStatus();
      }
    }, 1000);

    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'google_auth_success') {
        clearInterval(checkClosed);
        authWindow?.close();
        setIsLoading(false);
        onSuccess(event.data.user);
        window.removeEventListener('message', handleMessage);
      } else if (event.data.type === 'google_auth_error') {
        clearInterval(checkClosed);
        authWindow?.close();
        setIsLoading(false);
        onError?.(event.data.error || 'Authentication failed');
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up if component unmounts
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 300000); // 5 minutes timeout
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      if (data.authenticated) {
        onSuccess(data.user);
      }
    } catch (error) {
      onError?.('Failed to verify authentication status');
    }
  };

  return (
    <UnifiedButton
      onClick={handleSignIn}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Authenticating...' : buttonText}
    </UnifiedButton>
  );
};