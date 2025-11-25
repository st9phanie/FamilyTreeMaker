// useScriptLoader.ts

import { useState, useEffect } from 'react';

/**
 * Custom hook to dynamically load a script and CSS file.
 * @param scriptUrl The URL of the main script file (e.g., FamilyTree.js).
 * @param cssUrl The URL of the CSS file (e.g., familytree.css).
 * @returns boolean - True if the library is loaded and ready, false otherwise.
 */
const useScriptLoader = (scriptUrl: string, cssUrl: string): boolean => {
    // We track the loading state to know when the operation is complete.
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // We assume the global object is attached to 'window'.
        // The type assertion 'as any' is used here because the external library 
        // doesn't have built-in TypeScript definitions.
        if (typeof (window as any).FamilyTree !== 'undefined') {
            return;
        }

        setIsLoading(true);

        // 1. Load CSS
        const link = document.createElement('link');
        link.href = cssUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // 2. Load Script
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;

        const onScriptLoad = () => {
            setIsLoading(false); // Library is now available on window.FamilyTree
            console.log('FamilyTree script loaded successfully.');
        };

        const onScriptError = (error: Event | string) => {
            console.error("Failed to load FamilyTree script:", error);
            // Optional: Set a specific error state here if needed
            setIsLoading(false);
        };

        script.addEventListener('load', onScriptLoad);
        script.addEventListener('error', onScriptError);

        document.body.appendChild(script);

        // Cleanup function
        return () => {
            script.removeEventListener('load', onScriptLoad);
            script.removeEventListener('error', onScriptError);
            script.remove();
            link.remove();
        };
    }, [scriptUrl, cssUrl]);

    // Return true if the FamilyTree object exists on window, OR if we haven't started loading (initial state)
    return typeof (window as any).FamilyTree !== 'undefined' || !isLoading;
};

export default useScriptLoader;