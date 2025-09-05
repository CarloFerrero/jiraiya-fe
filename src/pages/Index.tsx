import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect legacy routes to new app structure
    const currentPath = location.pathname;
    
    if (currentPath === '/workspace') {
      navigate('/app/workspace', { replace: true });
    } else if (currentPath.startsWith('/workspace/')) {
      const projectId = currentPath.replace('/workspace/', '');
      navigate(`/app/workspace/${projectId}`, { replace: true });
    } else if (currentPath === '/methodologies') {
      navigate('/app/methodologies', { replace: true });
    } else {
      // Default redirect to app home
      navigate('/app', { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Reindirizzamento...</p>
      </div>
    </div>
  );
};

export default Index;
