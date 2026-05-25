
import { Button, Layout, Menu, theme } from 'antd';
import type { ReactNode } from 'react';
const { Header, Sider, Content } = Layout;

export const ContentComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            {children}
        </Content>
    )
}