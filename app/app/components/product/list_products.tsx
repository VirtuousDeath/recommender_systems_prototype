import React, { useEffect, useState } from 'react';

import type { GetProp, TableProps } from 'antd';
import { Button, FloatButton, Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { LikeFilled, LikeOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from 'react-router';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  name: string;
  value: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
  {
    title: 'Like',
    dataIndex: 'like',
  },
];

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

const ListProductsComponent: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [init, setInit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 0,
      pageSize: 10,
    },
  });
  const navigate = useNavigate();
  const params = toURLSearchParams(getRandomuserParams(tableParams));

  const fetchLikeData = async (name: string) => {
    let data = await fetch(`http://localhost:5000/product`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({ name: name })
    })
  }

  const generateLike = async (name: string) => {
    await fetchLikeData(name)
    await fetchData()
  }

  const fetchData = async () => {
    setLoading(true);
    let data = await fetch(`http://localhost:5000/products?${params.toString()}`)
    let res = await data.json()
    setData(Array.isArray(res) ? res.map(elem => ({ name: elem.nomeProduto, value: elem.quantidadeLikes, like: <Button icon={<LikeOutlined />} type="default" style={{ insetInlineEnd: 94 }} onClick={() => generateLike(elem.nomeProduto)} /> })) : []);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: tableParams.pagination?.current!,
        total: 100,
        // 100 is mock data, you should read it from server
        // total: data.totalCount,
      },
    });
  };

  useEffect(() => {
    if (init) (async () => {
      await fetchData();
    })();
    setInit(false)
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
    setInit(true)
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.name}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <FloatButton icon={<PlusCircleFilled />} type="default" style={{ insetInlineEnd: 94 }} onClick={() => navigate("/create_product")} />
    </>
  );
};

export default ListProductsComponent;