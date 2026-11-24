import { AlertTriangle, Headset, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

function ServerErrorPage() {
    const { t } = useTranslation("shared");

    return (
        <div className="h-[calc(100vh-10rem)] flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                    {/* 500 Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl font-bold text-red-500 mb-2">
                        500
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        {t("serverError.title")}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        {t("serverError.message")}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:support@gostack.com"
                            className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <Headset className="w-4 h-4 rtl:rotate-180" />
                            {t("serverError.contact")}
                        </a>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            {t("serverError.retry")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServerErrorPage;
