import React, { useRef, useState, useEffect, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useGetAppExplainQuery, useUpdateAppExplainMutation } from "../../redux/feature/setting.Api";
import { message } from "antd";

const AppExplain: React.FC = () => {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // GET API
    const { data, isLoading, error, refetch } = useGetAppExplainQuery(undefined);

    // POST + UPDATE API
    const [updatePolicy, { isLoading: isUpdating }] = useUpdateAppExplainMutation();

    // Load content from API
    useEffect(() => {
        if ((data as any)?.data?.content) {
            setContent((data as any).data.content);
        }
    }, [data]);;

    // Jodit Editor config
    const config = useMemo(
        () => ({
            theme: "default",
            showCharsCounter: false,
            showWordsCounter: false,
            toolbarAdaptive: true,
            toolbarSticky: false,
            enableDragAndDropFileToEditor: false,
            allowResizeX: false,
            allowResizeY: false,
            statusbar: false,
            buttons: [
                "source",
                "|",
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "font",
                "fontsize",
                "brush",
                "paragraph",
                "|",
                "left",
                "center",
                "right",
                "justify",
                "|",
                "undo",
                "redo",
                "|",
                "hr",
                "eraser",
                "fullsize",
            ],
            readonly: false,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            toolbarButtonSize: "small" as const,
        }),
        []
    );

    // Save Handler
    const handleSave = async () => {
        if (!content.trim()) {
            message.error("Content cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            await updatePolicy({ content }).unwrap();
            message.success("Privacy Policy saved successfully!");
            refetch();
        } catch (err: any) {
            console.error(err);
            message.error("Failed to saveAbout Us");
        } finally {
            setIsSaving(false);
        }
    };

    // Loading UI
    if (isLoading) {
        return (
            <div className="w-full border rounded-lg bg-white p-6 text-center">
                Loading App Explain Us...
            </div>
        );
    }

    // Error UI
    if (error) {
        return (
            <div className="w-full border rounded-lg bg-white p-6 text-center text-red-500">
                Failed to App Explain Us
            </div>
        );
    }

    return (
        <div className="w-full border rounded-lg bg-white px-4 py-5">
            <h1 className="text-[20px] font-medium py-5 mx-auto w-fit">App Explain </h1>

            {/* Jodit Editor */}
            <div className="mb-4">
                <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={(newContent) => setContent(newContent)}
                    config={config}
                />
                <div className="text-gray-500 text-sm mt-2">
                    {content.replace(/<[^>]*>/g, "").length} characters
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    className="px-6 py-2 border rounded-md"
                    onClick={() => setContent((data as any)?.data?.content || "")}
                    disabled={isSaving || isUpdating}
                >
                    Reset
                </button>

                <button
                    className={`px-6 py-2 text-white rounded-md ${isSaving || isUpdating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    onClick={handleSave}
                    disabled={isSaving || isUpdating}
                >
                    {isSaving || isUpdating ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default React.memo(AppExplain);
