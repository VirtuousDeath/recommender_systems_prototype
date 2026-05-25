import React, { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled } from '@ant-design/icons';
import { Navigate, useNavigate } from 'react-router';

import { CloseOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Card, FloatButton, Form, Input, Select, Space, Typography } from 'antd';
import { AutoComplete, Flex } from 'antd';
import type { AutoCompleteProps, GetProp } from 'antd';
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
const { Search } = Input;

const stylesObject: AutoCompleteProps['styles'] = {
  popup: {
    root: { borderWidth: 1, borderColor: '#1890ff' },
    list: { backgroundColor: 'rgba(240,240,240, 0.85)' },
    listItem: { color: '#272727' },
  },
};
const isNonNullable = <T,>(val: T): val is NonNullable<T> => {
  return val !== undefined && val !== null;
};

const toURLSearchParams = <T extends Record<PropertyKey, any>>(record: T) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, value);
  }
  return params;
};

const getRandomuserParams = (params: TableParams) => {
  const { pagination, filters, sortField, sortOrder, ...restParams } = params;
  const result: Record<string, any> = {};

  // https://github.com/mockapi-io/docs/wiki/Code-examples#pagination
  result.limit = pagination?.pageSize;
  result.page = pagination?.current;

  // https://github.com/mockapi-io/docs/wiki/Code-examples#filtering
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (isNonNullable(value)) {
        result[key] = value;
      }
    });
  }

  // https://github.com/mockapi-io/docs/wiki/Code-examples#sorting
  if (sortField) {
    result.orderby = sortField;
    result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
  }

  // 处理其他参数
  Object.entries(restParams).forEach(([key, value]) => {
    if (isNonNullable(value)) {
      result[key] = value;
    }
  });

  return result;
};

const CreateUserComponent: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([])
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteProps['options']>([])
  const [products, setProducts] = useState<Array<{ name: string, value: number }>>([])
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 0,
      pageSize: 10,
    },
  });
  const fetchPostData = async (body: any) => {
    let data = await fetch(`http://localhost:5000/user`, {
      headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify(body),
      method: 'POST'
    })
  }
  const [init, setInit] = useState(true);
  const params = toURLSearchParams(getRandomuserParams(tableParams));

  const fetchData = async () => {
    let data = await fetch(`http://localhost:5000/products?${params.toString()}`)
    let res = await data.json()
    // setData(Array.isArray(res) ? res : []);
    setOptions(Array.isArray(res) ? res.map((elem, idx) => ({ value: elem.nomeProduto })) : []);
    setFilteredOptions(Array.isArray(res) ? res.map((elem, idx) => ({ value: elem.nomeProduto })) : []);
  };

  useEffect(() => {
    if (init) (async () => {
      await fetchData();
    })();
    setInit(false)
  }, []);

  const onFinish = async (values: any) => {
    console.log('Received values of form:', values);
    await fetchPostData({ user: {name: values.items[0].name}, products: values.items[0].products.map((prod: { name: string, value: string }) => ({ name: prod.name, value: Number(prod.value) })) })
  }

  const [form] = Form.useForm();
  const sharedProps: AutoCompleteProps = {
    options: filteredOptions,
    classNames: {
    },
    style: { width: 200 },
  };
  const removeProduct = (index: number) => {
    setProducts(products.filter((src, idx) => (index !== idx)))
  }

  const addProduct = () => {
    setProducts(products.concat([{ name: '', value: 0 }]))
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{ items: [{ name: '', products: [{}] }] }}
      onFinish={onFinish}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Novo Cliente`}
                key={field.key}
              >
                <Form.Item label="Name" name={[field.name, 'name']}>
                  <Input />
                </Form.Item>

                {/* Nest Form.List */}
                <Form.Item label="Produtos">
                  <Form.List name={[field.name, 'products']}>
                    {(subFields, subOpt) => (
                      <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item noStyle name={[subField.name, 'name']}>
                              <AutoComplete {...sharedProps} placeholder="Nome do Produto" styles={stylesObject} onChange={() => (setFilteredOptions(options?.filter(src => (form.getFieldValue('items')[0].products.every((src2: { name: string, value: number }) => (src2.name !== src.value))))))} />
                              {/* <Input placeholder="" /> */}
                            </Form.Item>
                            <Form.Item noStyle name={[subField.name, 'value']}>
                              <Input placeholder="Valor no Produto" />
                            </Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          + Add Sub Item
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
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
  )
}

export default CreateUserComponent;