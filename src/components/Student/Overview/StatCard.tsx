import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface StatCardProps {
  label: string;
  number: string;
  bgColor: string;
  iconBgColor: string;
  icon: StaticImageData;
  params?: string;
}

export default function StatCard({
  label,
  number,
  bgColor,
  iconBgColor,
  icon,
  params,
}: StatCardProps) {
  const cardContent = (
    <div className="flex justify-between">
      <div>
        <p className="text-gray-600 text-sm md:text-base font-medium mb-2">
          {label}
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black">
          {number}
        </h2>
      </div>

      <div className="flex">
        <div
          className={`${iconBgColor} rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center`}
        >
          <Image className="w-10 h-10 object-contain" src={icon} alt="icon" />
        </div>
      </div>
    </div>
  );

  // If params exist => clickable link, else static
  if (params) {
    return (
      <Link
        href={`/student/${params}`}
        className={`${bgColor} rounded-2xl p-6 md:p-8 transition-transform hover:scale-105`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`${bgColor} rounded-2xl p-6 md:p-8`}>{cardContent}</div>
  );
}
