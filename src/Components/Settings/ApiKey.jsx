import { Button, Card, Input, message, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { generateApiKey } from "./SettingApi";
const { Text } = Typography;
function ApiKey() {
  const theme = useSelector((state) => state?.app?.theme);
  const [visible, setVisible] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) {
      message.warning("No API Key available");
      return;
    }

    await navigator.clipboard.writeText(apiKey);
    message.success("API Key copied");
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const data = await generateApiKey();

      if (data?.status) {
        setApiKey(data.apiKey);

        message.success(
          data?.message || "API key generated successfully"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
        width: "50%"
      }} >
      <div style={{ marginBottom: 8 }}>
        Your API Key
      </div>

      <Input.Group compact>
        <Input.Password
          value={apiKey}
          readOnly
          visibilityToggle={{
            visible,
            onVisibleChange: setVisible,
          }}
          suffix={
            <Typography.Text
              copyable={{
                text: apiKey,
              }}
            />
          }
          style={{width:"82%"}}
        />
        <Button
          type="primary"
          loading={loading}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </Input.Group>
    </Card>
  );
}
export default ApiKey;