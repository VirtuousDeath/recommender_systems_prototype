import React, { useEffect, useState } from 'react';

import type { GetProp, TableProps } from 'antd';
import { Button, Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router';
import { useParams } from "react-router";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
    name: string;
    target_name: string;
    product: string;
    likes: number;
    similarity: number;
    value: number;
}

interface DataRecommendationType {
    name: string;
    product: string;
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
        title: 'TargetName',
        dataIndex: 'target_name',
        width: '20%',
    },
    {
        title: 'Product',
        dataIndex: 'product',
        width: '20%',
    },
    {
        title: 'Likes',
        dataIndex: 'likes',
        width: '20%',
    },
    {
        title: 'Similarity',
        dataIndex: 'similarity',
        width: '20%',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        width: '20%',
    },
];

const columnsRecommendation: ColumnsType<DataRecommendationType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Product',
        dataIndex: 'product',
        width: '20%',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        width: '20%',
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

const DetailUserComponent: React.FC = () => {
    const [data, setData] = useState<DataType[]>();
    const [init, setInit] = useState(true);
    const [initRecommendation, setInitRecommendation] = useState(true);
    const [dataRecommendation, setDataRecommendation] = useState<DataRecommendationType[]>();
    const [loading, setLoading] = useState(false);
    const [loadingRecommendation, setLoadingRecommendation] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [tableParamsRecommendation, setTableParamsRecommendation] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const params = toURLSearchParams(getRandomuserParams(tableParams));
    const paramsRecommendation = toURLSearchParams(getRandomuserParams(tableParamsRecommendation));
    let { username } = useParams()
    const fetchData = async () => {
        setLoading(true);
        let data = await fetch(`http://localhost:5000/user/${username}?${params.toString()}`)
        let res = await data.json()
        setData(Array.isArray(res) ? res.map((elem, idx) => ({
            name: elem.nomeCliente,
            target_name: elem.nomeClienteDestino,
            product: elem.nomeProduto,
            likes: elem.quantidadeLikes,
            similarity: elem.similaridade,
            value: elem.valor,
        })) : []);
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

    const fetchDataRecommendation = async () => {
        setLoadingRecommendation(true);
        let data = await fetch(`http://localhost:5000/user_product/${username}?${paramsRecommendation.toString()}`)
        let res = await data.json()
        setDataRecommendation(Array.isArray(res) ? res.map((elem, idx) => ({ name: elem.nomeCliente, product: elem.nomeProduto, value: elem.valor })) : []);
        setLoadingRecommendation(false);
        setTableParamsRecommendation({
            ...tableParamsRecommendation,
            pagination: {
                ...tableParamsRecommendation.pagination,
                current: tableParamsRecommendation.pagination?.current!,
                total: 100,
                // 100 is mock data, you should read it from server
                // total: data.totalCount,
            },
        });
    };

    useEffect(() => {
        if (init) (async () => {
            await fetchData()
            setInit(false)
        })();
        if (initRecommendation) (async () => {
            await fetchDataRecommendation()
            setInitRecommendation(false)
        })();
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
        tableParamsRecommendation.pagination?.current,
        tableParamsRecommendation.pagination?.pageSize,
        tableParamsRecommendation?.sortOrder,
        tableParamsRecommendation?.sortField,
        JSON.stringify(tableParamsRecommendation.filters),

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

    const handleTableRecommendationChange: TableProps<DataRecommendationType>['onChange'] = (pagination, filters, sorter) => {
        setTableParamsRecommendation({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
        setInitRecommendation(true)

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataRecommendation([]);
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
            <Table<DataRecommendationType>
                columns={columnsRecommendation}
                rowKey={(record) => record.name}
                dataSource={dataRecommendation}
                pagination={tableParamsRecommendation.pagination}
                loading={loadingRecommendation}
                onChange={handleTableRecommendationChange}
            />
        </>
    );
};

export default DetailUserComponent;