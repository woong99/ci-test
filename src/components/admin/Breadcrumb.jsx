import React from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

const Breadcrumb = ({ menuTitle }) => {
    return (
        <div className="mb-4">
            <nav className="flex mb-5" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                    <li className="inline-flex items-center">
                        <div className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                            <HomeIcon className="w-5 h-5 mr-2.5" />
                            Home
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <ChevronRightIcon className="w-6 h-6 text-gray-400" />
                            <div className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">
                                {menuTitle}
                            </div>
                        </div>
                    </li>
                </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {menuTitle}
            </h1>
        </div>
    );
};

export default Breadcrumb;
