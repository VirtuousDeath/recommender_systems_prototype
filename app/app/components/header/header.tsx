import { Button, Layout, Menu, theme } from 'antd';
import { GeneralContext } from '~/contexts/general_context';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useContext } from 'react';

const { Header, Sider, Content } = Layout;

export const HeaderComponent: React.FC = () => {
    let [ context, setContext ] = useContext(GeneralContext)!
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={context.collapse_menu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setContext({ collapse_menu: !context.collapse_menu })}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
        </Header>
    )
}