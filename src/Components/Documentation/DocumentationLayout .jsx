import { ProLayout } from "@ant-design/pro-components";
import {
    FileTextOutlined,
    CodeOutlined,
    BookOutlined,
    HomeOutlined,
    ApiOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { Grid, Select, Space, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { changeLanguage, setPanel, setTheme } from "../../redux/reducers/reducer.app";
import { useDispatch, useSelector } from "react-redux";
import lang from "../../util/lang/lang";
import i18next, { t } from "i18next";

const { Text } = Typography;

const DocumentationProLayout = ({ children }) => {
    const navigate = useNavigate();
    const panel = useSelector((state) => state?.app?.panel);
    const language = useSelector((state) => state?.app?.lang);
    const theme = useSelector((state) => state?.app?.theme);
    const location = useLocation();
    const dispatch = useDispatch();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const toggleTheme = () => {
        const newTheme = !theme;
        dispatch(setTheme(newTheme));
        const currentPanel = panel || {};
        dispatch(
            setPanel({
                ...currentPanel,
                telecaller: {
                    ...currentPanel.telecaller,
                    theme: {
                        algorithm: newTheme ? "dark" : "light",
                        token: {
                            colorPrimary: "#1890ff",
                            borderRadius: 16,
                        },
                    },
                },
            }),
        );
    };

    const handleLanguageChange = (lang) => {
        const nextLang = lang ?? "en";
        i18next.changeLanguage(nextLang);
        dispatch(changeLanguage(nextLang));
    };

    const headerMenus = [
        {
            key: "/documentation/introduction",
            title: t("documentation", { defaultValue: "Documentation" }),
            icon: <FileTextOutlined />,
        },
        {
            key: "/documentation/api-reference",
            title: t("api.Reference", { defaultValue: "API Reference" }),
            icon: <CodeOutlined />,
        },
        {
            key: "/documentation/package-doc",
            title: t("package.Doc", { defaultValue: "Package Doc" }),
            icon: <BookOutlined />,
        },
    ];

    const menuRoutes = {
        path: "/documentation",
        routes: [
            {
                path: "/documentation/introduction",
                name: t("introduction", { defaultValue: "Introduction" }),
                icon: <HomeOutlined />,
            },
            {
                path: "/documentation/generate-apikey",
                name: t("generate.ApiKey", { defaultValue: "Generate API Key" }),
                icon: <HomeOutlined />,
            },
            {
                path: "/documentation/adddomain",
                name: t("add.Domain", { defaultValue: "Add Domain" }),
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
                    {t("e.Sender", { defaultValue: "E-Sender" })}
                </div>
            )}
            headerContentRender={() => {
                if (screens.md) {
                    return (
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
                                        <Text strong={location.pathname.startsWith(item.key)}>
                                            {item.title}
                                        </Text>
                                    </div>
                                ))}
                            </Space>
                        </div>
                    );
                }

                return (
                    <div
                        style={{
                            width: 220,
                            marginLeft: 16,
                        }}
                    >
                        <Select
                            value={
                                headerMenus.find((x) =>
                                    location.pathname.startsWith(x.key)
                                )?.key
                            }
                            style={{ width: "100%" }}
                            onChange={(value) => navigate(value)}
                            options={headerMenus.map((item) => ({
                                value: item.key,
                                label: item.title,
                            }))}
                        />
                    </div>
                );
            }}
            menuItemRender={(item, dom) => (
                <div
                    onClick={() => {
                        if (item.path) navigate(item.path);
                    }}
                >
                    {dom}
                </div>
            )}
            actionsRender={(props) => {
                if (props?.isMobile)
                    return [
                        theme ? (
                            <MoonOutlined
                                key="MoonOutlined"
                                onClick={toggleTheme}
                                style={{ marginRight: 20 }}
                            />
                        ) : (
                            <SunOutlined
                                key="SunOutlined"
                                onClick={toggleTheme}
                                style={{ marginRight: 20 }}
                            />
                        ),

                        <Select
                            value={language ?? "en"}
                            listHeight={200}
                            showSearch
                            style={{
                                height: 45,
                                width: 150,
                            }}
                            onChange={handleLanguageChange}
                            options={lang?.map((x) => ({
                                value: x.key,
                                label: x.name,
                            }))}
                            filterOption={(input, option) => {
                                return option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase());
                            }}
                        />
                    ];
                if (typeof window === "undefined") return [];
                return [
                    theme ? (
                        <MoonOutlined
                            key="MoonOutlined"
                            onClick={toggleTheme}
                            style={{ marginRight: 10 }}
                        />
                    ) : (
                        <SunOutlined
                            key="SunOutlined"
                            onClick={toggleTheme}
                            style={{ marginRight: 10 }}
                        />
                    ),
                    <>
                        <Select
                            value={language ?? "en"}
                            listHeight={200}
                            showSearch
                            style={{
                                height: 35,
                                width: 150,
                            }}
                            onChange={handleLanguageChange}
                            options={lang?.map((x) => ({
                                value: x.key,
                                label: x.name,
                            }))}
                            filterOption={(input, option) => {
                                return option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase());
                            }}
                        />
                    </>,
                ];
            }}
        >
            {children}
        </ProLayout>
    );
};

export default DocumentationProLayout;