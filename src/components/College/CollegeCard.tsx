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
        <Link href={`/${college.slug}`} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-indigo-400 mb-2">
                        {college.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {college.location}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4">
                        {college.description}
                    </p>
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
