import React from "react";
import { ProLayout, } from "@ant-design/pro-components";
import { Avatar, Dropdown, Typography, Space, } from "antd";
import { UserOutlined, LogoutOutlined, LaptopOutlined, } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const ProLayouts = ({ children }) => {

  const navigate = useNavigate();
  const profile = useSelector((state) => state?.user?.profile);

  // Dropdown Menu
  const items = [
    {
      key: "1",
      label: (
        <div>
          <Title
            level={5}
          >
            {profile.name}
          </Title>

          <Text type="secondary">
            {profile.phone}
          </Text>
        </div>
      ),
    },
    { type: "divider", },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Edit Profile",
    },
    {
      key: "3",
      icon: <LaptopOutlined />,
      label: "Session",
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

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
                    key: "3",
                    icon: <LaptopOutlined />,
                    label: (
                      <span>
                        Session
                      </span>
                    ),
                  },

                  {
                    key: "4",
                    icon: <LogoutOutlined />,
                    label: (
                      <span>
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