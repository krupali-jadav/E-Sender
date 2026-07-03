import { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Flex, Input, message, Popconfirm, Row, Space, Switch, Table, Tag, Typography, } from "antd";
import { PlusCircleOutlined, SearchOutlined, UploadOutlined, ExportOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import { t } from "i18next";
import ManualImport from "../../Contact/Contacts/ManualImport";
import ExcelImport from "../../Contact/Contacts/ExcelImport";
import AddContact from "../../Contact/Contacts/AddContact";
import ImportFromContacts from "../../Contact/Contacts/ImportFromContact";
import { getAllCustomFields } from "../../Contact/Custom Field/CustomeFieldApi";
import { exportToExcel } from "react-json-to-excel";
import { getCurrentTime } from "../../../util/commom.utils";
const { Title, Text } = Typography;

function ContactCampaigns({ campaignData, setCampaignData, setCurrent, showGroups }) {
  const [excelOpen, setExcelOpen] = useState(false);
  const [manualImportOpen, setManualImportOpen] = useState(false);
  const [AddContactOpen, setAddContactOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const handleSave = (contact) => {
    setCampaignData((prev) => {
      if (editContact) {
        return {
          ...prev,
          contacts: prev.contacts.map((item) =>
            item._id === contact._id ? contact : item
          ),
        };
      }
      return {
        ...prev,
        contacts: [...prev.contacts, contact],
      };
    });
    setEditContact(null);
    setAddContactOpen(false);
  };
  const handleDelete = (record) => {
    setCampaignData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter(
        (item) => item._id !== record._id
      ),
    }));
  };

  const fetchCustomFields = async () => {
    try {
      const data = await getAllCustomFields({
        page: 0,
        limit: 10,
      });

      if (data?.status) {
        setCustomFields(data.fields || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const confirmMessages = {
    clear: {
      title: "Clear All Contacts",
      description: "Are you sure you want to clear all contacts?",
    },
    duplicate: {
      title: "Remove Duplicate Contacts",
      description: "Are you sure you want to remove duplicate contacts?",
    },
    invalid: {
      title: "Remove Invalid Contacts",
      description: "Are you sure you want to remove invalid contacts?",
    },
    unsubscribe: {
      title: "Remove Unsubscribed Contacts",
      description: "Are you sure you want to remove unsubscribed contacts?",
    },
    spam: {
      title: "Remove Spam Contacts",
      description: "Are you sure you want to remove spam contacts?",
    },
    blocked: {
      title: "Remove Blocked Contacts",
      description: "Are you sure you want to remove blocked contacts?",
    },
    delete: {
      title: "Delete Contacts",
      description:
        "Are you sure you want to delete the selected contacts?",
    },
  };

  const customFieldColumns = customFields.map((field) => ({
    title: field.name,
    dataIndex: field._id,
    key: field._id,
    render: (_, record) => {
      const item = record.fields?.find(
        (f) => (f.fieldId?._id || f.fieldId) === field._id
      );
      return item?.value || "-";
    },
  }));

  const onExport = async () => {
    try {
      setExporting(true);

      const contacts = campaignData.contacts || [];

      if (contacts.length === 0) {
        message.warning("There are no contacts to export.");
        return;
      }

      setExporting(true);

      const exportData = contacts.map((contact) => ({
        Name: contact.name,
        Phone: contact.phonenumber,
        Email: contact.email,
        Blocked: contact.blocked ? "Yes" : "No",
        Spam: contact.spam ? "Yes" : "No",
        Unsubscribe: contact.unsubscribe ? "Yes" : "No",
      }));

      exportToExcel(exportData, `Campaign_Contacts_${getCurrentTime()}`);
    } catch (error) {
      console.error(error);
      message.error("An error occurred while exporting contacts.");
    } finally {
      setExporting(false);
    }
  };

  const handleContactAction = (type) => {
    setCampaignData((prev) => {
      let contacts = [...prev.contacts];

      switch (type) {

        case "clear":
          contacts = contacts.filter(
            (item) => !selectedRowKeys.includes(item._id)
          );
          setSelectedRowKeys([]);
          break;

        case "duplicate":
          contacts = contacts.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (c) =>
                  c.email === item.email
              )
          );
          break;

        case "invalid":
          contacts = contacts.filter(
            (item) =>
              item.email &&
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)
          );
          break;

        case "unsubscribe":
          contacts = contacts.filter((item) => !item.unsubscribe);
          break;

        case "spam":
          contacts = contacts.filter((item) => !item.spam);
          break;

        case "blocked":
          contacts = contacts.filter((item) => !item.blocked);
          break;

        case "delete":
          contacts = contacts.filter(
            (item) => !selectedRowKeys.includes(item._id)
          );
          setSelectedRowKeys([]);
          break;

        default:
          break;
      }

      return {
        ...prev,
        contacts,
      };
    });
  };

  // This is for disable
  const hasBlocked = campaignData.contacts.some((c) => c.blocked);
  const hasSpam = campaignData.contacts.some((c) => c.spam);
  const hasUnsubscribed = campaignData.contacts.some((c) => c.unsubscribe);
  const hasInvalid = campaignData.contacts.some(
    (c) => !c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
  );
  const hasDuplicate =
    campaignData.contacts.length !==
    new Set(campaignData.contacts.map((c) => c.email)).size;

  // This is for counting
  const totalCount = campaignData.contacts.length;
  const selectedCount = selectedRowKeys.length;
  const spamCount = campaignData.contacts.filter((c) => c.spam).length;
  const blockedCount = campaignData.contacts.filter((c) => c.blocked).length;
  const unsubscribedCount = campaignData.contacts.filter((c) => c.unsubscribe).length;
  const invalidCount = campaignData.contacts.filter(
    (c) => !c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
  ).length;
  const duplicateCount = campaignData.contacts.length -
    new Set(
      campaignData.contacts.map(
        (contact) => contact.email
      )
    ).size;

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: t("unsubscribed", { defaultValue: "Unsubscribed" }),
      dataIndex: "unsubscribe",
      key: "unsubscribed",
      render: (_, record) => (
        record.unsubscribed ? (
          <Tag>{record.unsubscribed}</Tag>
        ) : (
          "-"
        )),
    },
    {
      title: t("spam", { defaultValue: "Spam" }),
      dataIndex: "spam",
      key: "spam",
      render: (_, record) => (
        record.spam ? (
          <Tag>{record.spam}</Tag>
        ) : (
          "-"
        )),
    },
    {
      title: "Blocked",
      dataIndex: "blocked",
      key: "blocked",
      render: (blocked) =>
        blocked ? (
          <Tag>Yes</Tag>
        ) : (
          <Tag>No</Tag>
        ),
    },
    ...customFieldColumns,
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Flex gap={8}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditContact(record);
              setAddContactOpen(true);
            }}
          />

          <Popconfirm
            title="Delete Contact"
            description="Are you sure you want to delete this contact?"
            okText="Yes"
            cancelText="No"
            placement="top"
            onConfirm={() => handleDelete(record)}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Header */}
          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
              <Title level={5} style={{ margin: 0 }}>
                {t("select.audience", { defaultValue: "Select Audience" })}
              </Title>
            </Col>

            <Col>

              <Flex wrap="wrap" gap={8}>
                {/* <Button type="primary" icon={<UploadOutlined />} onClick={() => setManualImportOpen(true)}>
                  {t("import.from.groupst", { defaultValue: "Import From Groups" })}
                </Button> */}
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setImportOpen(true)}
                >
                  {t("import.from.contacts", {
                    defaultValue: "Import From Contacts",
                  })}
                </Button>

                <ImportFromContacts
                  open={importOpen}
                  onClose={() => setImportOpen(false)}
                  onImport={(contacts) => {
                    setCampaignData(prev => {
                      const ids = new Set(prev.contacts.map(x => x._id));

                      const newContacts = contacts.filter(
                        c => !ids.has(c._id)
                      );

                      return {
                        ...prev,
                        contacts: [...prev.contacts, ...newContacts],
                      };
                    });
                  }}
                />

                <Button type="primary" icon={<UploadOutlined />} onClick={() => setManualImportOpen(true)}>
                  {t("manual.import", { defaultValue: "Manual Import" })}
                </Button>

                <ManualImport
                  open={manualImportOpen}
                  onClose={() => setManualImportOpen(false)}
                  onImport={(contacts) => {
                    setCampaignData(prev => {
                      const ids = new Set(prev.contacts.map(x => x._id));

                      const newContacts = contacts.filter(
                        c => !ids.has(c._id)
                      );

                      return {
                        ...prev,
                        contacts: [...prev.contacts, ...newContacts],
                      };
                    });
                  }}
                  showGroups={false}
                />
                <Button type="primary" icon={<UploadOutlined />} onClick={() => setExcelOpen(true)}>
                  {t("excel.import", { defaultValue: "Excel Import" })}
                </Button>
                <ExcelImport
                  open={excelOpen}
                  onClose={() => setExcelOpen(false)}
                  onSubmit={(contacts) => {
                    setCampaignData(prev => {
                      const ids = new Set(prev.contacts.map(x => x._id));

                      const newContacts = contacts.filter(
                        c => !ids.has(c._id)
                      );

                      return {
                        ...prev,
                        contacts: [...prev.contacts, ...newContacts],
                      };
                    });
                  }}
                />

                <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setAddContactOpen(true)}>
                  {t("add.contact", { defaultValue: "Add Contact" })}
                </Button>
                <AddContact
                  open={AddContactOpen}
                  editData={editContact}
                  onClose={() => {
                    setAddContactOpen(false);
                    setEditContact(null);
                  }}
                  onSave={handleSave}
                  showGroups={false}
                />

                <Button type="primary" icon={<ExportOutlined />} onClick={onExport} loading={exporting} disabled={campaignData.contacts.length === 0}>
                  {t("export", { defaultValue: "Export" })}
                </Button>
              </Flex>
            </Col>
          </Row>

          <Divider style={{ margin: 0 }} />
          {/* search */}
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Input.Search
                placeholder={t("search", { defaultValue: "Search", })}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>

            <Col xs={24} md={16}>
              <Flex justify="end" wrap="wrap" gap={8}>
                <Popconfirm
                  title={confirmMessages.clear.title}
                  description={confirmMessages.clear.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("clear")}
                >
                  <Button
                    size="small"
                    disabled={selectedRowKeys.length === 0}
                  >
                    {t("clear.all", { defaultValue: "Clear All" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.duplicate.title}
                  description={confirmMessages.duplicate.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("duplicate")}
                >
                  <Button size="small" disabled={!hasDuplicate}>
                    {t("remove.duplicate", { defaultValue: "Remove Duplicate" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.invalid.title}
                  description={confirmMessages.invalid.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("invalid")}
                >
                  <Button size="small" disabled={!hasInvalid}>
                    {t("remove.invalid", { defaultValue: "Remove Invalid" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.unsubscribe.title}
                  description={confirmMessages.unsubscribe.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("unsubscribe")}
                >
                  <Button size="small" disabled={!hasUnsubscribed}>
                    {t("remove.unsubscribed", { defaultValue: "Remove Unsubscribed" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.spam.title}
                  description={confirmMessages.spam.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("spam")}
                >
                  <Button size="small" disabled={!hasSpam}>
                    {t("remove.spam", { defaultValue: "Remove Spam" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.blocked.title}
                  description={confirmMessages.blocked.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("blocked")}
                >
                  <Button size="small" disabled={!hasBlocked}>
                    {t("remove.blocked", { defaultValue: "Remove Blocked" })}
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title={confirmMessages.delete.title}
                  description={confirmMessages.delete.description}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleContactAction("delete")}
                >
                  <Button
                    size="small"
                    disabled={selectedRowKeys.length === 0}
                    danger
                  >
                    {t("delete", { defaultValue: "Delete" })}
                  </Button>
                </Popconfirm>
              </Flex>
            </Col>
          </Row>

          <Divider style={{ margin: 0 }} />

          <Table
            columns={columns}
            dataSource={campaignData.contacts}
            rowKey="_id"
            pagination={false}
            scroll={{ x: "max-content", y: 320 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
          />
          <Flex wrap="wrap" gap={16} style={{ padding: "12px 4px" }}>
            <Text strong>Total: {totalCount}</Text>
            <Text strong>Selected: {selectedCount}</Text>
            <Text strong>Duplicates: {duplicateCount}</Text>
            <Text strong>Invalid: {invalidCount}</Text>
            <Text strong>Blocked: {blockedCount}</Text>
            <Text strong>Spam: {spamCount}</Text>
            <Text strong>Unsubscribed: {unsubscribedCount}</Text>
          </Flex>
        </Space >

      </Card>
      <Flex justify="end" gap={10}>
        <Button onClick={() => setCurrent(1)}>{t("previous", { defaultValue: "Previous" })}</Button>
        <Button type="primary" onClick={async () => {
          try {
            if (!campaignData.contacts || campaignData.contacts.length === 0) {
              message.error("Add at least 1 Contact");
              return;
            }
            setCurrent(3);
          } catch (error) {
            message.error("Please select a template");
          }
        }}>{t("next", { defaultValue: "Next" })}</Button>
      </Flex>
    </Space>
  );
}

export default ContactCampaigns;