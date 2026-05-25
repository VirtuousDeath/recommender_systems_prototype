import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd';

const { Search } = Input;

const CreateProductComponent: React.FC = () => {
  const [form] = Form.useForm();
  const fetchPostData = async (body: any) => {
    let data = await fetch(`http://localhost:5000/products`, {
      headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify(body),
      method: 'POST'
    })
  }
  const onFinish = async (values: any) => {
    console.log('Received values of form:', values);
    await fetchPostData({ products: values.items })
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{ items: [{ name: '', likes: 0 }] }}
      onFinish={onFinish}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Novo Produto`}
                key={field.key}
              >
                <Form.Item label="Name" name={[field.name, 'name']}>
                  <Input />
                </Form.Item>
                <Form.Item label="Likes" name={[field.name, 'likes']}>
                  <Input />
                </Form.Item>

                {/* Nest Form.List */}
                <Form.Item label="List">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Card>
            ))}
          </div>
        )}
      </Form.List>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};

export default CreateProductComponent;