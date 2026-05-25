import { Button, Layout, Menu, theme } from 'antd';
import { GeneralContext } from '~/contexts/general_context';
import {
    CreditCardFilled,
    CreditCardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router';
const { Header, Sider, Content } = Layout;

export const MenuComponent: React.FC = () => {
    let [ context, setContext ] = useContext(GeneralContext)!
    const navigate = useNavigate();
    return (
        <Sider trigger={null} collapsible collapsed={context.collapse_menu}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '/users',
                        icon: <UserOutlined />,
                        label: 'Usuarios',
                    },
                    {
                        key: '/products',
                        icon: <CreditCardOutlined />,
                        label: 'Produtos',
                    },
                ]}
                onClick={({ key }) => navigate(key)} 
            />
        </Sider>
    )
}