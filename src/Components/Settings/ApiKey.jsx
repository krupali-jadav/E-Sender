import { Button, Card, Input, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function ApiKey() {
   const theme = useSelector((state) => state?.app?.theme);
  const apiKey = "demoApi_Key";
  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    message.success("API Key copied");
  };

  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
      }} >
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