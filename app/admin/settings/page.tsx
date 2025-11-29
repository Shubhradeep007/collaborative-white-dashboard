"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
    const updateSettings = useMutation(api.admin.updateSettings);
    const trialDurationSetting = useQuery(api.admin.getSettings, {
        key: "trialDuration",
    });
    const maxBoardsSetting = useQuery(api.admin.getSettings, {
        key: "maxBoards",
    });

    const [trialDuration, setTrialDuration] = useState("");
    const [maxBoards, setMaxBoards] = useState("");

    useEffect(() => {
        if (trialDurationSetting) {
            setTrialDuration(trialDurationSetting.value);
        }
    }, [trialDurationSetting]);

    useEffect(() => {
        if (maxBoardsSetting) {
            setMaxBoards(maxBoardsSetting.value);
        }
    }, [maxBoardsSetting]);

    const handleSave = async () => {
        try {
            await updateSettings({ key: "trialDuration", value: trialDuration });
            await updateSettings({ key: "maxBoards", value: maxBoards });
            toast.success("Settings updated");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            </div>
            <div className="grid gap-6 max-w-xl">
                <div className="grid gap-2">
                    <Label htmlFor="trialDuration">Trial Duration (days)</Label>
                    <Input
                        id="trialDuration"
                        value={trialDuration}
                        onChange={(e) => setTrialDuration(e.target.value)}
                        placeholder="e.g. 14"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="maxBoards">Max Free Boards</Label>
                    <Input
                        id="maxBoards"
                        value={maxBoards}
                        onChange={(e) => setMaxBoards(e.target.value)}
                        placeholder="e.g. 3"
                    />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </div>
    );
}
