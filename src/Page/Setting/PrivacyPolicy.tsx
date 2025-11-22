import React, { useRef, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { message } from "antd";
import {
  useGetPrivacyPolicyQuery,
  useUpdateSettingMutation,
} from "../../redux/feature/setting.Api";

const PrivacyPolicy: React.FC = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch privacy policy from backend
  const {
    data: privacyData,
    isLoading,
    error,
    refetch,
  } = useGetPrivacyPolicyQuery(undefined);

  // ✅ Update mutation
  const [updatePrivacy, { isLoading: isUpdating, error: updateError }] =
    useUpdateSettingMutation();

  // ✅ Set content when data is fetched
  useEffect(() => {
    if (privacyData?.data) {
      setContent(privacyData.data); // The API returns HTML inside data
    }
  }, [privacyData]);

  // ✅ Jodit Editor config
  const config = useMemo(
    () =>
      ({
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
      } as any),
    []
  );

  // ✅ Save handler
// In your PrivacyPolicy component
const handleSave = async () => {
  if (!content.trim()) {
    message.error("Privacy Policy content cannot be empty");
    return;
  }

  try {
    setIsSaving(true);
    
    // Log what we're sending
    const payload = { privacyPolicy: content };
    console.log("📤 Sending payload:", payload);
    console.log("📤 Payload keys:", Object.keys(payload));
    console.log("📤 Content length:", content.length);
    
    const result = await updatePrivacy(payload).unwrap();
    
    console.log("✅ Success response:", result);
    message.success("Privacy Policy updated successfully");
    refetch();
    
  } catch (error: any) {
    console.error("❌ Full error object:", error);
    console.error("❌ Error status:", error?.status);
    console.error("❌ Error data:", error?.data);
    console.error("❌ Error message:", error?.data?.message);
    
    // Extract detailed error message
    let errorMessage = "Failed to update Privacy Policy.";
    
    if (error?.data?.message) {
      errorMessage = error.data.message;
    } else if (error?.data?.error) {
      errorMessage = error.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    message.error(errorMessage);
  } finally {
    setIsSaving(false);
  }
};

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[400px] border rounded-lg bg-white px-4 py-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading Privacy Policy...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="w-full h-[400px] border rounded-lg bg-white px-4 py-5 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading Privacy Policy</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg bg-white px-4 py-5">
      <h1 className="text-[20px] font-medium py-5 w-fit mx-auto">
        Privacy Policy
      </h1>

      {/* ✅ Update error display */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error updating Privacy Policy. Please try again.
        </div>
      )}

      {/* ✅ Rich Text Editor */}
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
        config={config}
      />

      {/* ✅ Save Button */}
      <div className="flex items-center justify-end">
        <button
          className={`text-[16px] text-white px-10 py-2.5 mt-5 rounded-md ${
            isSaving || isUpdating
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

export default React.memo(PrivacyPolicy);
