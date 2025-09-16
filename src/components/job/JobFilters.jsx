import React from 'react';
import FilterSelect from '../common/FilterSelect';
import { STATUS_FILTER_OPTIONS, DATE_FILTER_OPTIONS, SORT_OPTIONS } from '../../utils/statusConfig';

export default function JobFilters({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  groupByDate,
  setGroupByDate,
  setCollapsedGroups,
  filteredJobs,
  groupJobsByDate,
  showGroupControls = true
}) {
  return (
    <>
      <div className="w-full bg-secondary-600 p-6 rounded-xl mb-4">
        {/* Mobile Layout - Single Column */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
          
          <FilterSelect
            label="Filter by Date"
            value={dateFilter}
            onChange={setDateFilter}
            options={DATE_FILTER_OPTIONS}
          />

          <FilterSelect
            label="Filter by Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
          />

          <FilterSelect
            label="Sort Results"
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
          />

          {/* Group Controls */}
          {showGroupControls && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-primary-700">
                Display Options
              </label>
              
              {/* Group by Date Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="groupByDate-mobile"
                  checked={groupByDate}
                  onChange={(e) => setGroupByDate(e.target.checked)}
                  className="w-4 h-4 accent-primary-700"
                />
                <label htmlFor="groupByDate-mobile" className="text-sm font-medium text-primary-700 cursor-pointer">
                  Group by Date
                </label>
              </div>

              {/* Collapse/Expand Controls */}
              {groupByDate && (
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setCollapsedGroups(new Set())}
                    className="text-primary-700 hover:text-primary-800 font-medium underline 
                             underline-offset-2 transition-colors duration-200"
                  >
                    Expand All
                  </button>
                  <span className="text-primary-500">•</span>
                  <button
                    onClick={() => {
                      const groupedJobs = groupJobsByDate(filteredJobs);
                      setCollapsedGroups(new Set(Object.keys(groupedJobs)));
                    }}
                    className="text-primary-700 hover:text-primary-800 font-medium underline 
                             underline-offset-2 transition-colors duration-200"
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Layout - Two Rows */}
        <div className="hidden lg:block space-y-6">
          
          {/* First Row: Filter by Date, Status, and Sort Results */}
          <div className="grid grid-cols-3 gap-6 items-end">
            <FilterSelect
              label="Filter by Date"
              value={dateFilter}
              onChange={setDateFilter}
              options={DATE_FILTER_OPTIONS}
            />

            <FilterSelect
              label="Filter by Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
            />

            <FilterSelect
              label="Sort Results"
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
            />
          </div>

          {/* Second Row: Display Options */}
          {showGroupControls && (
            <div className="space-y-3 flex items-center gap-4">              
              <div className="flex items-center justify-between gap-4">
                {/* Group by Date Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="groupByDate-desktop"
                    checked={groupByDate}
                    onChange={(e) => setGroupByDate(e.target.checked)}
                    className="w-4 h-4 accent-primary-700"
                  />
                  <label htmlFor="groupByDate-desktop" className="text-sm font-medium text-primary-700 cursor-pointer">
                    Group by Date
                  </label>
                </div>

                {/* Collapse/Expand Controls */}
                {groupByDate && (
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={() => setCollapsedGroups(new Set())}
                      className="text-primary-700 hover:text-primary-800 font-medium underline 
                               underline-offset-2 transition-colors duration-200"
                    >
                      Expand All
                    </button>
                    <span className="text-primary-500">•</span>
                    <button
                      onClick={() => {
                        const groupedJobs = groupJobsByDate(filteredJobs);
                        setCollapsedGroups(new Set(Object.keys(groupedJobs)));
                      }}
                      className="text-primary-700 hover:text-primary-800 font-medium underline 
                               underline-offset-2 transition-colors duration-200"
                    >
                      Collapse All
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count - Now separate below the filter bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-primary-700 font-medium">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>
    </>
  );
}
