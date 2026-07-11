import { ProLayout } from "@ant-design/pro-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProLayouts from "../site/ProLayouts";

const docRoute = {
    path: "/documentation",
    routes: [
        {
            path: "/documentation",
            name: "Documentation",
            routes: [
                { path: "/documentation/introduction", name: "Introduction" },
                { path: "/documentation/generate-apikey", name: "Generate API Key" },
                { path: "/documentation/adddomain", name: "Add Domain" },
            ],
        },
    ],
};

export default function DocumentationLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <ProLayouts>
            <div style={{ height: "calc(100vh - 64px)", margin: "-28px", overflow: "hidden" }}>
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
                            <div style={{ cursor: "pointer" }} onClick={() => navigate(item.path)}>
                                {dom}
                            </div>
                        );
                    }}
                    contentStyle={{
                        padding: 0,
                        
                    }}
                >
                    <div style={{ height: "calc(100vh - 64px)", overflow: "auto", scrollbarWidth: "none",  }}>
                        <Outlet />
                    </div>
                </ProLayout>
            </div>
        </ProLayouts>
    );
}   