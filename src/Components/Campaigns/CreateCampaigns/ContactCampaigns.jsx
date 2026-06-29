import { useState } from "react";
import { Button, Card, Checkbox, Col, Divider, Flex, Input, Row, Space, Switch, Table, Typography, } from "antd";
import { PlusCircleOutlined, SearchOutlined, UploadOutlined, ExportOutlined, } from "@ant-design/icons";
import { t } from "i18next";
import ManualImport from "../../Contact/Contacts/ManualImport";
import ExcelImport from "../../Contact/Contacts/ExcelImport";
import AddContact from "../../Contact/Contacts/AddContact";
import ImportFromContacts from "../../Contact/Contacts/ImportFromContact";
import { addCampaignContacts, } from "../../../redux/reducers/reducer.Campaign";
import { useDispatch, useSelector } from "react-redux";
const { Title } = Typography;

function ContactCampaigns() {
  const [excelOpen, setExcelOpen] = useState(false);
  const [manualImportOpen, setManualImportOpen] = useState(false);
  const [AddContactOpen, setAddContactOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const dispatch = useDispatch();
  const campaignContacts = useSelector((state) => state.campaign.contacts);

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      width: 50,
      render: () => <Checkbox />,
    },
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
      dataIndex: "phone",
      key: "phone",
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
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "right",
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
                <Button type="primary" icon={<UploadOutlined />} onClick={() => setManualImportOpen(true)}>
                  {t("import.from.groupst", { defaultValue: "Import From Groups" })}
                </Button>
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
                  onImport={(selectedContacts) => {
                    dispatch(addCampaignContacts(selectedContacts));
                  }}
                />

                <Button type="primary" icon={<UploadOutlined />} onClick={() => setManualImportOpen(true)}>
                  {t("manual.import", { defaultValue: "Manual Import" })}
                </Button>
                <ManualImport
                  open={manualImportOpen}
                  onClose={() => setManualImportOpen(false)}
                  onImport={(selectedContacts) => {
                    dispatch(addCampaignContacts(selectedContacts));
                  }}
                />

                <Button type="primary" icon={<UploadOutlined />} onClick={() => setExcelOpen(true)}>
                  {t("excel.import", { defaultValue: "Excel Import" })}
                </Button>
                <ExcelImport
                  open={excelOpen}
                  onClose={() => setExcelOpen(false)}
                />

                <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setAddContactOpen(true)}>
                  {t("add.contact", { defaultValue: "Add Contact" })}
                </Button>
                <AddContact
                  open={AddContactOpen}
                  onClose={() => setAddContactOpen(false)}
                />

                <Button type="primary" icon={<ExportOutlined />}>
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
                <Button size="small">{t("clear.all", { defaultValue: "Clear All" })}</Button>
                <Button size="small">{t("remove.duplicate", { defaultValue: "Remove Duplicate" })}</Button>
                <Button size="small">{t("remove.invalid", { defaultValue: "Remove Invalid" })}</Button>
                <Button size="small">{t("remove.invalid", { defaultValue: "Remove Unsubscribed" })}</Button>
                <Button size="small">{t("remove.invalid", { defaultValue: "Remove Spam" })}</Button>
                <Button size="small">{t("remove.invalid", { defaultValue: "Remove Blocked" })}</Button>
                <Button size="small">{t("delete", { defaultValue: "Delete" })}</Button>
              </Flex>
            </Col>
          </Row>

          <Divider style={{ margin: 0 }} />

          <Table
            columns={columns}
            dataSource={campaignContacts}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </Space >

      </Card>
      <Flex justify="end" gap={10}>
        <Button>{t("previous", { defaultValue: "Previous" })}</Button>
        <Button type="primary">{t("next", { defaultValue: "Next" })}</Button>
      </Flex>
    </Space>
  );
}

export default ContactCampaigns;