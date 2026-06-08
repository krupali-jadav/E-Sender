import { Button, Card, Input, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

function ApiKey() {
  const apiKey = "demoApi_Key";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    message.success("API Key copied");
  };

  return (
    <Card>
      <div style={{ marginBottom: 8 }}>
        Your API Key
      </div>

      <Input.Group compact>
        <Input.Password
          value={apiKey}
          readOnly
          visibilityToggle={false}
          style={{ width: "calc(100% - 120px)" }}
        />

        <Button
          icon={<CopyOutlined />}
          onClick={handleCopy}
        />

        <Button type="primary">
          Generate
        </Button>
      </Input.Group>
    </Card>
  );
}
export default ApiKey