import Link from 'next/link';

interface StatCardProps {
    title: string;
    value: number;
    previousValue: number;
    icon: string;
    href?: string;
}

const StatCard = ({
    title,
    value,
    previousValue,
    icon,
    href,
}: StatCardProps) => {
    const increase = value - previousValue;

    const cardContent = (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <h2 className="text-xl font-semibold text-indigo-500 dark:text-indigo-400">
                {icon} {title}
            </h2>
            <p className="text-2xl font-bold mt-2">
                {value}
                {increase > 0 && (
                    <span className="text-sm text-green-500 ml-2">
                        (+{increase})
                    </span>
                )}
            </p>
        </div>
    );

    return href ? (
        <Link href={href}>{cardContent}</Link>
    ) : (
        <div>{cardContent}</div>
    );
};

export default StatCard;
