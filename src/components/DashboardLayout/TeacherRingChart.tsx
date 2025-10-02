import { useGetAdminStatQuery } from "@/redux/api/admin/stat";
import { PieChart, Pie, Cell } from "recharts";

const TeacherRingChart = () => {
    const { data: adminStat } = useGetAdminStatQuery(undefined);
    const total = adminStat?.result?.TeacherRingChert?.activeTeacher + adminStat?.result?.TeacherRingChert?.inActiveTeacher;

    const chartData = [
        { name: "Active", value: adminStat?.result?.TeacherRingChert?.activeTeacher },
        { name: "Inactive", value: adminStat?.result?.TeacherRingChert?.inActiveTeacher },
    ];

    const COLORS = ["#1E3A8A", "#1E3A8A1A"];

    return (
        <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold text-start mb-4">Teachers Activities</h2>
            <div className="flex flex-col items-center relative">

                <PieChart width={220} height={220}>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        cornerRadius={50}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>

                <div className="absolute text-center mt-[-120px] top-[75%]">
                    <p className="text-gray-500">Total</p>
                    <p className="text-3xl font-bold">{total}</p>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1E3A8A]"></span>
                        <p className="text-sm">
                            {((adminStat?.result?.TeacherRingChert?.activeTeacher / total) * 100).toFixed(0)}% Active
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1E3A8A1A]"></span>
                        <p className="text-sm">
                            {((adminStat?.result?.TeacherRingChert?.inActiveTeacher / total) * 100).toFixed(0)}% Inactive
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherRingChart;
