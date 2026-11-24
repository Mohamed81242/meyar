import { useEffect, useState } from "react";
import ServerErrorPage from "../pages/ServerErrorPage";
import { errorHistory } from "./errorHistory";

interface ServerErrorGuardProps {
    children?: React.ReactNode;
}

export function ServerErrorGuard({ children }: ServerErrorGuardProps) {
    const [hasError, setHasError] = useState(() => errorHistory.hasError());

    useEffect(() => {
        const handleServerError = () => {
            setHasError(true);
        };

        window.addEventListener("server-error", handleServerError);

        return () => {
            window.removeEventListener("server-error", handleServerError);
        };
    }, []);

    useEffect(() => {
        if (hasError) {
            errorHistory.clear();
        }
    }, [hasError]);

    if (hasError) {
        return <ServerErrorPage />;
    }

    return <>{children}</>;
}

export default ServerErrorGuard;
