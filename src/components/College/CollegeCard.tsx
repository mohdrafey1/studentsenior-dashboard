import Link from 'next/link';

interface CollegeCardProps {
    college: {
        _id: string;
        name: string;
        description: string;
        location: string;
        slug: string;
        status: boolean;
    };
}

const CollegeCard = ({ college }: CollegeCardProps) => {
    return (
        <Link href={`/${college.slug}`} className="block h-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="p-6 flex-1">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-indigo-400 mb-2 line-clamp-2">
                        {college.name}
                    </h2>

                    {/* Location */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-1">
                        {college.location}
                    </p>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4">
                        {college.description}
                    </p>
                </div>

                {/* Status */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <span
                            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                college.status
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {college.status ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CollegeCard;
