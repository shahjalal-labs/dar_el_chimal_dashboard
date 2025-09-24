/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useGetOrderChartQuery } from '@/redux/api/playground/stat';
import { useGetEventOrderChartQuery } from '@/redux/api/eventOrganizer/stat';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useGetEcommerceOrderChartQuery } from '@/redux/api/ecommerce/stat';
import { useGetAdminOrderChartQuery } from '@/redux/api/admin/stat';

const CustomTooltip = ({ active, payload }: { active: any; payload: any; }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: '#FF6B00',
                    border: '2px solid #FF6B00',
                    borderRadius: '10px',
                    padding: '10px',
                    textAlign: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                className='text-white'
            >
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                    {payload[0].payload.totalOrder} {payload[0].payload.totalOrder > 1 ? 'Orders' : 'Order'}
                </p>
                <p style={{ margin: 0, fontSize: '0.9em' }}>{payload[0].payload.date}</p>
            </div>
        );
    }
    return null;
};

const OrderChart = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const [data, setData] = useState([]);
    const { data: GroundChart } = useGetOrderChartQuery(undefined);
    const { data: EventChart } = useGetEventOrderChartQuery(undefined);
    const { data: EcommerceChart } = useGetEcommerceOrderChartQuery(undefined);
    const { data: AdminChart } = useGetAdminOrderChartQuery(undefined);

    useEffect(() => {
        if (GroundChart?.result) {
            setData(GroundChart?.result)
        }
        if (EventChart?.result) {
            setData(EventChart?.result)
        }
        if (EcommerceChart?.result) {
            setData(EcommerceChart?.result)
        }
        if (AdminChart?.result) {
            setData(AdminChart?.result)
        }
    }, [GroundChart, EventChart, EcommerceChart, AdminChart])

    const chartData = Array.isArray(data)
        ? data?.map((info: { day: string, date: string, totalOrder: number }) => ({
            day: info?.day,
            date: info?.date,
            totalOrder: info?.totalOrder,
        }))
        : [];

    return (
        <div className='bg-white rounded-2xl h-fit p-6'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-bold">
                    {
                        authState.businessCategory === 'EVENT' ?
                            'Event Chart' : 'Order Chart'
                    }
                </h1>
                {/* <div className=''>
                    <Select
                        required
                    >
                        <SelectTrigger className="w-full flex items-center gap-2 outline-none">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin">2025</SelectItem>
                            <SelectItem value="Warden">2026</SelectItem>
                            <SelectItem value="Leader">2027</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis hide={true} />
                    <Tooltip content={CustomTooltip} cursor={{ fill: 'transparent' }} />
                    <Bar
                        dataKey="totalOrder"
                        fill="#FF6B00"
                        radius={[5, 5, 5, 5]}
                        barSize={10}
                    />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderChart;