import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Pagination = ({ pageCount, handleChangePage, nowPage, pageRangeDisplayed }) => {
    return (
        <div className="flex items-center justify-center bg-white px-4 py-3 sm:px-6">
            <ReactPaginate
                previousLabel={<ChevronLeftIcon className="w-5 h-5" />}
                previousClassName="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                nextLabel={<ChevronRightIcon className="w-5 h-5" />}
                nextClassName="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                activeClassName="bg-potato-1 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-potato-2"
                pageClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                breakClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                pageCount={pageCount}
                marginPagesDisplayed={1}
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                onPageChange={async (page) => {
                    await handleChangePage(page);
                }}
                forcePage={nowPage}
                pageRangeDisplayed={pageRangeDisplayed}
            />
        </div>
    );
};

export default Pagination;
