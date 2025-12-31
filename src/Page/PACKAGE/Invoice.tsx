import { useState } from "react";
import { useCreateInvoiceMutation, useGetInvoiceQuery } from "../../redux/feature/Package";

const InvoiceSettings = () => {
    const [value, setValue] = useState("");

    // GET invoice data
    const { data, isLoading, isError } = useGetInvoiceQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    // CREATE invoice
    const [createInvoice, { isLoading: creating }] =
        useCreateInvoiceMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!value) return;

        try {
            await createInvoice({ value: Number(value) }).unwrap();
            setValue("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">
                Free Invoice Settings
            </h2>

            {/* 🔹 Show current value */}
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading invoice data</p>}

            {data && (
                <p className="mb-4">
                    <strong>Current Free Invoice Count:</strong>{" "}
                    {data?.data?.value}
                </p>
            )}

            {/* 🔹 Create / Update form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Set invoice value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full border p-2 mb-3"
                />

                <button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {creating ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
};

export default InvoiceSettings;
