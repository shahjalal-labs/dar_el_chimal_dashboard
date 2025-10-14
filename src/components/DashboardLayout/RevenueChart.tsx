/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SyncLoader } from 'react-spinners';
import { ChevronDownIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { label, value } = payload[0].payload;
    return (
      <div className="bg-[#1E3A8A] text-white text-sm rounded-md px-4 py-2 shadow">
        <p className="font-semibold">{`${label}`}</p>
        <p>{`Value : ${value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data, revenueYear, setRevenueYear }: { data: any, revenueYear: string, setRevenueYear: React.Dispatch<React.SetStateAction<string>>; }) => {
  // const currentYear = new Date().getFullYear();
  // const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const types = [
    { name: "Daily", value: "daily" },
    { name: "Weekly", value: "weekly" },
    { name: "Monthly", value: "monthly" },
    { name: "Yearly", value: "yearly" },
  ]
  const chartData = Array.isArray(data?.chartData)
    ? data?.chartData?.map(({ label, value }: { label: string, value: number }) => ({
      label: label,
      value: value,
    }))
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Student Overview</h1>
        <div className='bg-gray-100 px-4 py-2 rounded-lg'>
          <Select
            value={revenueYear}
            onValueChange={(value: string) => setRevenueYear(value)}
            required
          >
            <SelectTrigger className="w-full flex items-center gap-2 outline-none border-none">
              <SelectValue placeholder="Select Type" />
              <ChevronDownIcon />
            </SelectTrigger>
            <SelectContent>
              {types?.map((type, idx) => (
                <SelectItem key={idx} value={String(type.value)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {
        !data ?
          <div className="flex justify-center items-center gap-4">
            <span className="text-[#1E3A8A]">Student Overview is Loading</span>
            <SyncLoader color='#1E3A8A' />
          </div> :
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(val) => `${val / 100}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1E3A8A"
                fill="url(#orangeGradient)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
      }
    </div>
  )
};

export default RevenueChart;
