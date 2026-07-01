import { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Divider, Flex, Input, message, Row, Space, Switch, Table, Tag, Typography, } from "antd";
import { PlusCircleOutlined, SearchOutlined, UploadOutlined, ExportOutlined, } from "@ant-design/icons";
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

  const fetchCustomFields = async () => {
    try {
      const data = await getAllCustomFields({
        page: 0,
        limit: 100,
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
          contacts = [];
          break;

        case "duplicate":
          contacts = contacts.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (c) =>
                  c.email === item.email ||
                  c.phonenumber === item.phonenumber ||
                  c.name === item.name
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

  const totalCount = campaignData.contacts.length;
  const selectedCount = selectedRowKeys.length;
  const spamCount = campaignData.contacts.filter((c) => c.spam).length;
  const blockedCount = campaignData.contacts.filter((c) => c.blocked).length;
  const unsubscribedCount = campaignData.contacts.filter((c) => c.unsubscribe).length;
  const invalidCount = campaignData.contacts.filter(
    (c) => !c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
  ).length;

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
          <Tag>{record.unsubscribed}  </Tag>
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
          <Tag>{record.spam}  </Tag>
        ) : (
          "-"
        )),
    },
    {
      title: "Blocked",
      dataIndex: "blocked",
      key: "blocked",
      render: (blocked, record) => (
        <Switch
          size="large"
          checked={blocked}
          onChange={(checked) =>
            handleBlockStatus(record, checked)
          }
        />
      ),
    },
    ...customFieldColumns,
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
                  onClose={() => setAddContactOpen(false)}
                  onSave={(contact) => {
                    setCampaignData((prev) => ({
                      ...prev,
                      contacts: [...prev.contacts, contact],
                    }));
                  }}
                  showGroups={false}
                />

                <Button type="primary" icon={<ExportOutlined />} onClick={onExport} loading={exporting}>
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
                <Button size="small" onClick={() => handleContactAction("clear")}>{t("clear.all", { defaultValue: "Clear All" })}</Button>
                <Button size="small" onClick={() => handleContactAction("duplicate")}>{t("remove.duplicate", { defaultValue: "Remove Duplicate" })}</Button>
                <Button size="small" onClick={() => handleContactAction("invalid")}>{t("remove.invalid", { defaultValue: "Remove Invalid" })}</Button>
                <Button size="small" onClick={() => handleContactAction("unsubscribe")}>{t("remove.invalid", { defaultValue: "Remove Unsubscribed" })}</Button>
                <Button size="small" onClick={() => handleContactAction("spam")}>{t("remove.invalid", { defaultValue: "Remove Spam" })}</Button>
                <Button size="small" onClick={() => handleContactAction("blocked")}>{t("remove.invalid", { defaultValue: "Remove Blocked" })}</Button>
                <Button size="small" onClick={() => handleContactAction("delete")}> Delete</Button>
              </Flex>
            </Col>
          </Row>

          <Divider style={{ margin: 0 }} />

          <Table
            columns={columns}
            dataSource={campaignData.contacts}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 1000 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
          />
          <Flex wrap="wrap" gap={16} style={{ padding: "12px 4px" }}>
            <Text strong>Total: {totalCount}</Text>
            <Text strong>Selected: {selectedCount}</Text>
            <Text strong>Spam: {spamCount}</Text>
            <Text strong>Blocked: {blockedCount}</Text>
            <Text strong>Invalid: {invalidCount}</Text>
            <Text strong>Unsubscribed: {unsubscribedCount}</Text>
          </Flex>
        </Space >

      </Card>
      <Flex justify="end" gap={10}>
        <Button onClick={() => setCurrent(1)}>{t("previous", { defaultValue: "Previous" })}</Button>
        <Button type="primary" onClick={() => setCurrent(3)}>{t("next", { defaultValue: "Next" })}</Button>
      </Flex>
    </Space>
  );
}

export default ContactCampaigns;