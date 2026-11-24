import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    SettingsSubSidebar,
    PersonalInformationTab,
    ChangeEmailTab,
    ChangePhoneTab,
    ChangePasswordTab,
    SettingAlertsTab,
    SubscriptionsTab,
    type SettingsTabId,
} from "../components";

export default function SettingsPage() {
    const { tab } = useParams<{ tab?: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Determine initial tab from route param or query param
    const tabFromUrl = (tab || searchParams.get("tab") || "personal") as SettingsTabId;
    const [activeTab, setActiveTab] = useState<SettingsTabId>(
        ["personal", "email", "phone", "password", "settings", "subscriptions"].includes(tabFromUrl)
            ? tabFromUrl
            : "personal"
    );

    useEffect(() => {
        if (tab && ["personal", "email", "phone", "password", "settings", "subscriptions"].includes(tab)) {
            setActiveTab(tab as SettingsTabId);
        }
    }, [tab]);

    const handleSelectTab = (newTab: SettingsTabId) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab });
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "personal":
                return <PersonalInformationTab />;
            case "email":
                return <ChangeEmailTab />;
            case "phone":
                return <ChangePhoneTab />;
            case "password":
                return <ChangePasswordTab />;
            case "settings":
                return <SettingAlertsTab />;
            case "subscriptions":
                return <SubscriptionsTab />;
            default:
                return <PersonalInformationTab />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 pb-12 w-full select-none items-start">
            {/* Left Sub-Sidebar Card matching Screenshot 1 */}
            <SettingsSubSidebar
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
            />

            {/* Right Tab Content Area */}
            <main className="flex-1 w-full min-w-0">
                {renderActiveTab()}
            </main>
        </div>
    );
}
