import React, { useEffect } from 'react';

const LiveChat = () => {
    useEffect(() => {
        // Add Tawk.to script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://embed.tawk.to/your-property-id/default';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            const tawkScript = document.querySelector('script[src="https://embed.tawk.to/your-property-id/default"]');
            if (tawkScript) {
                tawkScript.remove();
            }
        };
    }, []);

    return null;
};

export default LiveChat;
