import React from 'react';
import { RiCheckFill } from 'react-icons/ri';
import Dropdown from './Dropdown';

const ReviewSort = ({ sortCondition, sortDirection, handleChangeSort }) => {
    const selectOptions = [
        { value: '', label: '최신순' },
        { value: 'scoreDESCENDING', label: '평점 높은 순' },
        { value: 'scoreASCENDING', label: '평점 낮은 순' },
    ];

    const handleSort = (value) => {
        if (value === '') {
            handleChangeSort('', '');
        } else if (value === 'scoreDESCENDING') {
            handleChangeSort('score', 'DESCENDING');
        } else if (value === 'scoreASCENDING') {
            handleChangeSort('score', 'ASCENDING');
        }
    };

    return (
        <div className="space-x-3 flex items-center">
            <div className="hidden md:flex items-center space-x-3">
                <button
                    className="border-r-2 text-gray-400 pr-3 flex items-center"
                    onClick={() => {
                        sortCondition !== '' && handleChangeSort('', '');
                    }}>
                    {sortCondition === '' && <RiCheckFill className="text-black text-xl" />}
                    <span className={`hover:underline ${sortCondition === '' && 'text-black'}`}>
                        최신순
                    </span>
                </button>
                <button
                    className="border-r-2 text-gray-400 pr-3 flex items-center"
                    onClick={() => {
                        (sortCondition !== 'score' || sortDirection !== 'DESCENDING') &&
                            handleChangeSort('score', 'DESCENDING');
                    }}>
                    {sortCondition === 'score' && sortDirection === 'DESCENDING' && (
                        <RiCheckFill className="text-black text-xl" />
                    )}
                    <span
                        className={`hover:underline ${
                            sortCondition === 'score' &&
                            sortDirection === 'DESCENDING' &&
                            'text-black'
                        }`}>
                        평점 높은순
                    </span>
                </button>
                <button
                    className="text-gray-400 flex items-center"
                    onClick={() => {
                        (sortCondition !== 'score' || sortDirection !== 'ASCENDING') &&
                            handleChangeSort('score', 'ASCENDING');
                    }}>
                    {sortCondition === 'score' && sortDirection === 'ASCENDING' && (
                        <RiCheckFill className="text-black text-xl" />
                    )}
                    <span
                        className={`hover:underline ${
                            sortCondition === 'score' &&
                            sortDirection === 'ASCENDING' &&
                            'text-black'
                        }`}>
                        평점 낮은순
                    </span>
                </button>
            </div>
            <div className="md:hidden w-full">
                <Dropdown
                    options={selectOptions}
                    selectedOption={sortCondition + sortDirection}
                    onOptionSelect={(option) => {
                        handleSort(option.value);
                    }}
                />
            </div>
        </div>
    );
};

export default ReviewSort;
