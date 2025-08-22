import { useState, useEffect } from 'react';

interface WorkspaceLayoutState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  isSafari: boolean;
  isIOS: boolean;
}

export const useWorkspaceLayout = () => {
  const [layout, setLayout] = useState<WorkspaceLayoutState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1024,
        screenHeight: 768,
        isLandscape: true,
        isSafari: false,
        isIOS: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent;
    
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      screenWidth: width,
      screenHeight: height,
      isLandscape: width > height,
      isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
    };
  });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      
      setLayout({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        isLandscape: width > height,
        isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
        isIOS: /iPad|iPhone|iPod/.test(userAgent),
      });
    };

    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateLayout, 150);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    // Also listen for viewport meta changes on iOS
    if (layout.isIOS) {
      window.addEventListener('scroll', debouncedUpdate);
    }

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
      if (layout.isIOS) {
        window.removeEventListener('scroll', debouncedUpdate);
      }
      clearTimeout(timeoutId);
    };
  }, [layout.isIOS]);

  return layout;
};
