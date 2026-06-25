import { ProLayout, } from "@ant-design/pro-components";
import { Avatar, Breadcrumb, Dropdown, Select, Typography } from "antd";
import { UserOutlined, LogoutOutlined, LaptopOutlined, HomeOutlined, TeamOutlined, DatabaseOutlined, SafetyCertificateOutlined, FileTextOutlined, ReadOutlined, ShoppingCartOutlined, MoonOutlined, SunOutlined, ContainerOutlined, GlobalOutlined, } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/action";
import { changeLanguage, setPanel, setTheme } from "../../redux/reducers/reducer.app";
import i18next, { t } from "i18next";
import lang from "../../util/lang/lang";
import { LuLogs } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCampaign, MdOutlinePermMedia, MdWebhook } from "react-icons/md";
// import { t } from "i18next";

const { Title, Text } = Typography;

const ProLayouts = ({ children }) => {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state?.user?.profile);
  const panel = useSelector((state) => state?.app?.panel);
  const language = useSelector((state) => state?.app?.lang);
  const theme = useSelector((state) => state?.app?.theme);

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

  const BreadcrumbCustom = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const items = pathSegments.map((segment, index) => {
      let pathToNavigate = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLastSegment = index === pathSegments.length - 1;

      if (segment === "order") {
        pathToNavigate = pathToNavigate.replace(/\/order$/, "/orders");
      }

      return {
        title: isLastSegment ? (
          <span style={{ textTransform: "capitalize" }}>{segment}</span>
        ) : (
          <span
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            onClick={() => {
              navigate(pathToNavigate);
            }}
          >
            {segment}
          </span>
        ),
      };
    });

    const breadcrumbItems = [
      { title: <HomeOutlined onClick={() => navigate("/")} /> },
      ...items,
    ];

    return <Breadcrumb items={breadcrumbItems?.filter(Boolean)} />;
  };

  const handleLanguageChange = (lang) => {
    const nextLang = lang ?? "en";
    i18next.changeLanguage(nextLang);
    dispatch(changeLanguage(nextLang));
  };

  const menuRoutes = {
    path: "/",
    routes: [
      {
        path: "/dashboard",
        name: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        path: "/campaigns",
        name: "Campaigns",
        icon: <MdOutlineCampaign />,
      },
      {
        path: "/templates",
        name: "Templates",
        icon: <ContainerOutlined />,
      },
      {
        path: "/domains",
        name: "Domains",
        icon: <GlobalOutlined />,
      },
      {
        path: "/contact",
        name: "Contact",
        icon: <TeamOutlined />,
        routes: [
          {
            path: "/contact/contacts",
            name: "Contacts",
            icon: <DatabaseOutlined />,
          },
          {
            path: "/contact/groups",
            name: "Groups",
            icon: <DatabaseOutlined />,
          },
          {
            path: "/contact/custom-fields",
            name: "Custom Fields",
            icon: <DatabaseOutlined />,
          },
        ],
      },
      {
        path: "/logs",
        name: "Logs",
        icon: <LuLogs />,
      },
      {
        path: "/orders",
        name: "Orders",
        icon: <ShoppingCartOutlined />,
      },
      {
        path: "/webhooks",
        name: "WebHooks",
        icon: <MdWebhook />,
      },
      {
        path: "/media",
        name: "Media",
        icon: <MdOutlinePermMedia />,
      },
      {
        path: "/settings",
        name: "Settings",
        icon: <IoSettingsOutline />,
      },
      {
        path: "/documentation",
        name: "Documentation",
        icon: <FileTextOutlined />,
      },
      {
        path: "/privacy-policy",
        name: "Privacy Policy",
        icon: <SafetyCertificateOutlined />,
      },
      {
        path: "/terms-and-conditions",
        name: "Terms and Conditions",
        icon: <FileTextOutlined />,
      },
      {
        path: "/refund-policy",
        name: "Refund Policy",
        icon: <ReadOutlined />,
      },
    ],
  };
  return (
    <ProLayout
      layout="mix"
      title="E-Sender"
      breadcrumbRender={(routers = []) => routers}
      headerContentRender={() => <BreadcrumbCustom />}
      route={menuRoutes}
      location={{
        pathname: location.pathname,
      }}
      logo={false}
      avatarProps={{
        render: () => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <>
                        <Title level={5}>
                          {profile?.name}
                        </Title>

                        <Text type="secondary">
                          {profile?.phone}
                        </Text>
                      </>
                    ),
                  },

                  {
                    type: "divider",
                  },

                  {
                    key: "2",
                    icon: <UserOutlined />,
                    label: (
                      <span onClick={() => { navigate("/edit-profile") }}>
                        {t("edit.profile", { defaultValue: "Edit Profile" })}
                      </span>
                    ),
                  },
                  // {
                  //   label: (
                  //     <Button
                  //       ghost={true}
                  //       type="secondary"
                  //       onClick={() => {
                  //         navigate("/sessions");
                  //       }}
                  //     >
                  //       {/* {t("session", { defaultValue: "Session" })} */}Session
                  //     </Button>
                  //   ),
                  //   key: "3",
                  //   title: t("session", { defaultValue: "Session" }),
                  //   icon: <LaptopOutlined />,
                  // },
                  {
                    key: "3",
                    icon: <LaptopOutlined />,
                    label: (
                      <span onClick={() => { navigate("/sessions") }}>
                        {t("session", { defaultValue: "Session" })}
                      </span>
                    ),
                  },
                  {
                    key: "4",
                    icon: <LogoutOutlined />,
                    label: (
                      <span onClick={() => {
                        dispatch(logout());
                        navigate("/");
                      }}>
                        {t("logout", { defaultValue: "Logout" })}
                      </span>
                    ),
                  },
                ],
              }}
              placement="bottom"
              arrow={{
                pointAtCenter: true,
              }}
            >
              <Avatar
                size="medium"
                icon={<UserOutlined />}
              />
            </Dropdown>
          );
        },
      }}

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


      location={{
        pathname: location.pathname,
      }
      }


      route={menuRoutes}

      menuItemRender={(item, dom) => {
        const externalPages = [
          "/privacy-policy",
          "/terms-and-conditions",
          "/refund-policy",
        ];

        if (externalPages.includes(item.path)) {
          return (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                window.open(
                  item.path,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              {dom}
            </div>
          );
        }

        return (
          <div
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              }
            }}
          >
            {dom}
          </div>
        );
      }}

    >
      {children}
    </ProLayout >
  );
};

export default ProLayouts;