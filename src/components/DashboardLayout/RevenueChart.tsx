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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, revenue } = payload[0].payload;
    return (
      <div className="bg-[#FF7F00] text-white text-sm rounded-md px-4 py-2 shadow">
        <p className="font-semibold">{`${name}`}</p>
        <p>{`Revenue : $${revenue.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data, revenueYear, setRevenueYear }: { data: any, revenueYear: string, setRevenueYear: React.Dispatch<React.SetStateAction<string>>; }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const chartData = Array.isArray(data)
    ? data.map((info: { month: string, totalAmount: number }) => ({
      name: info?.month,
      revenue: info?.totalAmount,
    }))
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Total Revenue</h1>
        <div className='bg-gray-100 px-4 py-2 rounded-lg'>
          <Select
            value={revenueYear}
            onValueChange={(value: string) => setRevenueYear(value)}
            required
          >
            <SelectTrigger className="w-full flex items-center gap-2 outline-none border-none">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7F00" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FF7F00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(val) => `$${val / 100}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#FF7F00"
            fill="url(#orangeGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
};

export default RevenueChart;
