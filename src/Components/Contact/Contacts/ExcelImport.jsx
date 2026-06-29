import { ExcelImporter } from "antd-spreadsheet-import";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { bulkAddContacts } from "./ContactsApi";
import { getAllCustomFields } from "../../Contact/Custom Field/CustomeFieldApi"; 
import { t } from "i18next";

function ExcelImport({ open, onClose, onSubmit = () => { } }) {
    const [submitting, setSubmitting] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);

    useEffect(() => {
        if (!open) return;
        const fetchCustomFields = async () => {
            setLoadingFields(true);
            try {
                const res = await getAllCustomFields({});
                const list = res?.fields || [];
                setCustomFields(list);
            } finally {
                setLoadingFields(false);
            }
        };

        fetchCustomFields();
    }, [open]);

    const baseFields = useMemo(
        () => [
            {
                label: t("name", { defaultValue: "Name" }),
                key: "name",
                fieldType: { type: "input" },
                example: "Optional",
            },
            {
                label: t("email", { defaultValue: "Email" }),
                key: "email",
                fieldType: { type: "input" },
                example: "Optional",
            },
            {
                label: t("phone", { defaultValue: "Phone" }),
                key: "phone",
                fieldType: { type: "input" },
                example: "Required",

            },
        ],
        [t]
    );

    const dynamicFields = useMemo(() => {
        return customFields.map((field) => ({
            label: field.name || field.label,
            key: field._id || field.id,
            fieldType: { type: "input" },
            example: "Optional",
        }));
    }, [customFields]);

    const fields = useMemo(
        () => [...baseFields, ...dynamicFields],
        [baseFields, dynamicFields]
    );
    // Har row se name/email/phone alag karo, baaki sab custom_fields me daalo
    const buildPayloadRow = (row) => {
        const identifier = row?.key ?? row?.id ?? uuidv4();
        const { name, email, phone, ...rest } = row;

        const fields = customFields
            .map((field) => {
                const fieldKey = field._id || field.id;
                const value = rest[fieldKey];
                if (value === undefined || value === "") return null;
                return {
                    fieldId: fieldKey,
                    value: value,
                };
            })
            .filter(Boolean);

        return {
            key: identifier,
            id: identifier,
            name,
            email,
            phone,
            fields,
        };
    };

    const handleSubmit = async (data) => {
        const safeRows = Array.isArray(data) ? data : [];
        const missingPhone = safeRows.some((row) => !row.phone);
        if (missingPhone) {
            message.error(t("phone.required", { defaultValue: "Phone number is required for all rows" }));
            return;
        }

        const enrichedRows = safeRows.map(buildPayloadRow);
        console.log("Final payload being sent:", JSON.stringify(enrichedRows, null, 2));

        setSubmitting(true);
        try {
            const result = await bulkAddContacts({ contacts: enrichedRows });
            message.success(result?.message || "Bulk contacts added successfully");
            onSubmit(enrichedRows, result);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ExcelImporter
            open={open}
            fields={fields}
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={submitting || loadingFields}
        />
    );
}

export default ExcelImport;