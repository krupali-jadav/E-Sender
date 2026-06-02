import { ProLayout, } from "@ant-design/pro-components";
import { Avatar, Dropdown, Typography } from "antd";
import { UserOutlined, LogoutOutlined, LaptopOutlined, HomeOutlined, TeamOutlined, DatabaseOutlined, SafetyCertificateOutlined, FileTextOutlined, ReadOutlined, ShoppingCartOutlined, } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/action";
// import { t } from "i18next";

const { Title, Text } = Typography;

const ProLayouts = ({ children }) => {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state?.user?.profile);

  const menuRoutes = {
    path: "/",
    routes: [
      {
        path: "/dashboard",
        name: "Dashboard",
        icon: <HomeOutlined />,
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
        path: "/orders",
        name: "Orders",
        icon: <ShoppingCartOutlined />,
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
                        Edit Profile
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
                        Session
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
                        Logout
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



      location={{
        pathname: location.pathname,
      }}


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
    </ProLayout>
  );
};

export default ProLayouts;