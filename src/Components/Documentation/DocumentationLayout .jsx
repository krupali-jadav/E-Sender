import { ProLayout } from "@ant-design/pro-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// Group documentation pages into categories here.
const docRoute = {
    path: "/documentation",
    routes: [
        {
            path: "/documentation",     
            name: "Documentation",
            routes: [
                {
                    path: "/documentation/introduction",
                    name: "Introduction",
                },
                {
                    path: "/documentation/generate-apikey",
                    name: "Generate API Key",
                },
                {
                    path: "/documentation/adddomain",
                    name: "Add Domain",
                },
            ],
        },
    ],
};
export default function DocumentationLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 64px)", // adjust 64px if your header height is different
                margin: "-25px",
                overflow: "hidden",
            }}
        >
            <ProLayout
                route={docRoute}
                location={{ pathname: location.pathname }}
                layout="side"
                siderWidth={220}
                fixSiderbar={false}
                headerRender={false}
                footerRender={false}
                breadcrumbRender={false}
                menuHeaderRender={false}
                title={false}
                logo={false}
                token={{
                    sider: {
                        colorMenuBackground: "transparent",
                    },
                }}
                menuItemRender={(item, dom) => {
                    if (item.routes) return dom;

                    return (
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(item.path)}
                        >
                            {dom}
                        </div>
                    );
                }}
                style={{
                    position: "static",
                    height: "100%",
                    background: "transparent",
                }}
                contentStyle={{ display: "none" }}
            >
                <span />
            </ProLayout>

            <div
                style={{
                    flex: 1,
                    overflow: "auto",
                    // padding: "0 24px",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
}