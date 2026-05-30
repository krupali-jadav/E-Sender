import React from "react";
import { ProLayout, } from "@ant-design/pro-components";
import { Avatar, Button, Dropdown, Typography } from "antd";
import { UserOutlined, LogoutOutlined, LaptopOutlined, } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/action";
import { t } from "i18next";

const { Title, Text } = Typography;

const ProLayouts = ({ children }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state?.user?.profile);

  // Dropdown Menu
  // const items = [
  //   {
  //     key: "1",
  //     label: (
  //       <div>
  //         <Title
  //           level={5}
  //         >
  //           {profile.name}
  //         </Title>

  //         <Text type="secondary">
  //           {profile.phone}
  //         </Text>
  //       </div>
  //     ),
  //   },
  //   { type: "divider", },
  //   {
  //     key: "2",
  //     icon: <UserOutlined />,
  //     label: "Edit Profile",
  //   },
  //   {
  //     key: "3",
  //     icon: <LaptopOutlined />,
  //     label: "Session",
  //   },
  //   {
  //     key: "4",
  //     icon: <LogoutOutlined />,
  //     label: "Logout",
  //   },
  // ];

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

                  {
                    label: (
                      <Button
                        ghost={true}
                        type="secondary"
                        onClick={() => {
                          navigate("/sessions");
                        }}
                      >
                        {/* {t("session", { defaultValue: "Session" })} */}Session
                      </Button>
                    ),
                    key: "3",
                    title: t("session", { defaultValue: "Session" }),
                    icon: <LaptopOutlined />,
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
    >
      {children}
    </ProLayout>
  );
};

export default ProLayouts;