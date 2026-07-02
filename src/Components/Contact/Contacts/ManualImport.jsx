import { Modal, Form, Input, Select, Button, Table, message, } from "antd";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { bulkAddContacts } from "./ContactsApi";
import { getAllGroups } from "../Group/GroupApi";
import { getAllCustomFields } from "../Custom Field/CustomeFieldApi";

const { TextArea } = Input;

const ManualImport = ({ open, onClose, fetchContacts, onImport, showGroups }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactsText, setContactsText] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [previewData, setPreviewData] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await getAllGroups({
        page: 0,
        search: "",
      });

      if (response?.status) {
        setGroups(response.groups || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomFields = async () => {
    try {
      const response = await getAllCustomFields({
        page: 0,
        search: "",
      });

      if (response?.status) {
        setCustomFields(response.fields || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchGroups();
      fetchCustomFields();
    }
  }, [open]);

  const parseContacts = (text) => {
    setPreviewData((prev) => {
      const rows = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => {
          const parts = line.split(",").map((p) => p.trim());
          const [name, email, phone, ...customValues] = parts;
          const existingRow = prev.find((item) => item.key === index);
          const customFieldData = {};
          customFields.forEach((field, i) => {
            if (customValues[i] !== undefined && customValues[i] !== "") {
              customFieldData[field._id] = customValues[i];
            }
          });

          return {
            ...existingRow,
            ...customFieldData,
            key: index,
            sn: index + 1,
            name: name?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
          };
        });

      return rows;
    });
  };
  const dynamicColumns = customFields.map((field) => ({
    title: field.name,
    dataIndex: field._id,
    key: field._id,
  }));

  const handleImport = async () => {
    if (!contactsText.trim()) {
      message.warning("Please enter contacts");
      return;
    }

    setLoading(true);

    try {
      const contacts = previewData.map((row) => ({
        name: row.name,
        email: row.email,
        phonenumber: row.phone,
        groups: selectedGroups,
        fields: customFields
          .filter((field) => row[field._id])
          .map((field) => ({
            fieldId: field._id,
            value: row[field._id],
          })),
      }));

      const payload = { contacts };

      // Contact Campaign
      if (onImport) {
        onImport(contacts);                                                             
        message.success("Contacts imported successfully");
        handleClose();
        return;
      }

      // Contacts page
      const response = await bulkAddContacts(payload);
      if (response?.status) {
        message.success(response.message || "Bulk contacts added successfully");

        fetchContacts?.();

        handleClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContactsText("");
    setPreviewData([]);
    setSelectedGroups([]);
    setFieldValues({});
    onClose();
  };
  const columns = [
    {
      title: t("sn", { defaultValue: "SN" }),
      width: 70,
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("email", { defaultValue: "Email" }),
      width: 220,
      dataIndex: "email",
      key: "email",
    }, {
      title: t("phone_number", { defaultValue: "Phone Number" }),
      dataIndex: "phone",
      key: "phone",
    },
    ...dynamicColumns
  ]

  return (
    <Modal
      title={t("manual.import", { defaultValue: "Manual Import" })}
      open={open}
      onCancel={onClose}
      width={1000}
      centered
      footer={[
        <Button key="cancel" onClose={handleClose} onClick={onClose}>
          {t("cancel", { defaultValue: "Cancel" })}
        </Button>,
        <Button key="import" type="primary" loading={loading} onClick={handleImport}>
          {t("import", { defaultValue: "Import" })}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          label={t("contacts", { defaultValue: "Contacts" })}
        >
          <TextArea
            rows={8}
            value={contactsText}
            onChange={(e) => {
              const value = e.target.value;
              setContactsText(value);
              parseContacts(value);
            }}
          />
        </Form.Item>

        {showGroups && (
          <Form.Item label={t("groups", { defaultValue: "Groups" })}>
            <Select
              mode="multiple"
              value={selectedGroups}
              onChange={(value) => setSelectedGroups(value)}
              showSearch
              placeholder={t("select.groups", { defaultValue: "Select Groups" })}
              options={groups.map((group) => ({
                label: group.name,
                value: group._id,
              }))}
            />
          </Form.Item>
        )}

        <Table
          columns={columns}
          dataSource={[]}
          pagination={false}
          dataSource={previewData}
          scroll={{ y: 260 }}
        />
      </Form>
    </Modal>
  );
};

export default ManualImport;