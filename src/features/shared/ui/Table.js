// src/features/shared/ui/Table.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table component for displaying tabular data
 */
const Table = ({
  columns,
  data,
  isLoading = false,
  emptyState,
  stickyHeader = false,
  striped = true,
  bordered = false,
  hoverable = true,
  compact = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'w-full table-auto';

  // Style variants
  const variantClasses = [
    striped ? 'even:bg-background-secondary' : '',
    bordered ? 'border border-border-light' : '',
    hoverable ? 'hover:bg-background-tertiary' : '',
    compact ? 'text-sm' : '',
  ].filter(Boolean).join(' ');

  // Sticky header class
  const stickyHeaderClass = stickyHeader ? 'sticky top-0 z-10' : '';

  // Combine classes
  const tableClasses = [baseClasses, className].join(' ');

  if (isLoading) {
    return (
      <div className="relative min-h-[200px] border border-border-light rounded-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        <table className={tableClasses} {...props}>
          <thead className={stickyHeaderClass}>
            <tr className="bg-background-secondary border-b border-border-light">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-md py-sm text-left font-semibold text-text-secondary"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-md py-sm border-b border-border-light">
                    <div className="h-4 bg-background-tertiary rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="border border-border-light rounded-md overflow-hidden">
        <table className={tableClasses} {...props}>
          <thead className={stickyHeaderClass}>
            <tr className="bg-background-secondary border-b border-border-light">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-md py-sm text-left font-semibold text-text-secondary"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="flex flex-col items-center justify-center py-lg text-center text-text-tertiary">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border-light rounded-md overflow-auto">
      <table className={tableClasses} {...props}>
        <thead className={stickyHeaderClass}>
          <tr className="bg-background-secondary border-b border-border-light">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-md py-sm text-left font-semibold text-text-secondary"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={variantClasses + " border-b border-border-light"}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-md py-sm"
                >
                  {column.accessor ? (
                    typeof column.accessor === 'function'
                      ? column.accessor(row, rowIndex)
                      : row[column.accessor]
                  ) : (
                    column.cell ? column.cell(row, rowIndex) : null
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      cell: PropTypes.func,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  emptyState: PropTypes.node,
  stickyHeader: PropTypes.bool,
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default Table;