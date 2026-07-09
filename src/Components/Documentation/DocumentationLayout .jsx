import { ProLayout } from "@ant-design/pro-components";
import {
    FileTextOutlined,
    CodeOutlined,
    BookOutlined,
    HomeOutlined,
    ApiOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Space, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;

const DocumentationProLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const headerMenus = [
        {
            key: "/documentation/introduction",
            title: "Documentation",
            icon: <FileTextOutlined />,
        },
        {
            key: "/documentation/api-reference",
            title: "API Reference",
            icon: <CodeOutlined />,
        },
        {
            key: "/documentation/knowledge-base",
            title: "Package Doc",
            icon: <BookOutlined />,
        },
    ];

    const menuRoutes = {
        path: "/documentation",
        routes: [
            {
                path: "/documentation/introduction",
                name: "Introduction",
                icon: <HomeOutlined />,
            },
            {
                path: "/documentation/generate-apikey",
                name: "Generate API Key",
                icon: <HomeOutlined />,
            },
            {
                path: "/documentation/adddomain",
                name: "Add Domain",
                icon: <ApiOutlined />,
            },
        ],
    };

    return (
        <ProLayout

            logo={false}
            layout="mix"
            splitMenus={false}
            route={menuRoutes}
            location={{
                pathname: location.pathname,
            }}
            headerTitleRender={() => (
                <div
                    onClick={() => navigate("/dashboard")}
                    style={{
                        cursor: "pointer",
                        fontSize: 18,
                        fontWeight: 600,
                        marginLeft: 15,

                    }}
                >
                    E-Sender
                </div>
            )}
            headerContentRender={() => (
                <div
                    style={{
                        marginLeft: 90, 
                    }}
                >
                    <Space size={32}>
                        {headerMenus.map((item) => (
                            <div
                                key={item.key}
                                onClick={() => navigate(item.key)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                }}
                            >
                                {item.icon}
                                <Text
                                    strong={location.pathname.startsWith(item.key)}
                                >
                                    {item.title}
                                </Text>
                            </div>
                        ))}
                    </Space>
                </div>
            )}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                        if (item.path) navigate(item.path);
                    }}
                >
                    {dom}
                </div>
            )}
            
        >
            {children}
        </ProLayout>
    );
};

export default DocumentationProLayout;