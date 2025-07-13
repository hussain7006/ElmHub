import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const PostMessageHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Listen for messages from parent
        const handleMessage = (event) => {
            if (event.data?.type === "elmhub") {
                console.log("Received theme from parent:", event.data);
                let { showHeader, theme, colors } = event.data;
                // Handle showHeader from the message
                dispatch({ type: "SETSHOWHEADER", payload: showHeader });
                dispatch({ type: "SETTHEME", payload: theme });
                dispatch({ type: "SETTHEMEMODE", payload: theme.mode });
                dispatch({ type: "SETCOLORS", payload: colors });

            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [dispatch]);

    return null; // This component doesn't render anything
};

export default PostMessageHandler; 