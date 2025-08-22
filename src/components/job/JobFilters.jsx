import React from 'react';

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
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="date-newest">Date (Newest)</option>
            <option value="date-oldest">Date (Oldest)</option>
            <option value="status">Status</option>
            <option value="client">Client Name</option>
          </select>
        </div>

        {/* Group by Date Toggle - only show if enabled */}
        {showGroupControls && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={groupByDate}
                onChange={(e) => setGroupByDate(e.target.checked)}
                className="mr-2"
              />
              Group by Date
            </label>
          </div>
        )}

        {/* Collapse/Expand Controls - only show when grouping is enabled */}
        {showGroupControls && groupByDate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsedGroups(new Set())}
              className="text-xs text-primary-600 hover:text-primary-800 underline"
            >
              Expand All
            </button>
            <span className="text-xs text-gray-400">|</span>
            <button
              onClick={() => {
                const groupedJobs = groupJobsByDate(filteredJobs);
                setCollapsedGroups(new Set(Object.keys(groupedJobs)));
              }}
              className="text-xs text-primary-600 hover:text-primary-800 underline"
            >
              Collapse All
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
