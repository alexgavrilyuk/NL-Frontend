// src/features/datasets/components/DatasetDetail.js

import React from 'react';
import Card from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';
import Table from '../../shared/ui/Table';

const DatasetDetail = ({ dataset }) => {
  if (!dataset) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dataset-detail space-y-lg">
      {/* Overview Card */}
      <Card title="Dataset Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">Original Filename</h4>
            <p className="text-text-primary">{dataset.fileInfo.originalName}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">File Type</h4>
            <p className="text-text-primary">
              {dataset.fileInfo.contentType === 'text/csv' ? 'CSV' : 'Excel'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">File Size</h4>
            <p className="text-text-primary">{formatFileSize(dataset.fileInfo.size)}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">Upload Date</h4>
            <p className="text-text-primary">{formatDate(dataset.created)}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">Row Count</h4>
            <p className="text-text-primary">{dataset.schema?.rowCount || 'Unknown'}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-tertiary mb-1">Status</h4>
            <p className="text-text-primary">
              {dataset.ignored ? (
                <Badge variant="warning">Ignored</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Schema Card */}
      <Card title="Schema">
        <div className="overflow-x-auto">
          <Table
            columns={[
              { header: 'Column Name', accessor: 'name' },
              { header: 'Type', accessor: (col) => (
                <Badge variant={
                  col.type === 'number' ? 'primary' :
                  col.type === 'date' ? 'info' :
                  'default'
                } size="sm">
                  {col.type}
                </Badge>
              )},
              { header: 'Description', accessor: 'description' },
              { header: 'Sample Values', accessor: (col) => (
                <div className="text-sm">
                  {col.examples && col.examples.slice(0, 3).map((example, i) => (
                    <span key={i} className="mr-sm">
                      {typeof example === 'object' ? JSON.stringify(example) : String(example)}
                    </span>
                  ))}
                </div>
              )}
            ]}
            data={dataset.schema?.columns || []}
            emptyState="No schema information available"
          />
        </div>
      </Card>

      {/* Sample Data Card */}
      {dataset.schema?.sampleData && dataset.schema.sampleData.length > 0 && (
        <Card title="Sample Data">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-background-secondary">
                  {Object.keys(dataset.schema.sampleData[0]).map(key => (
                    <th key={key} className="px-md py-sm text-left font-semibold text-text-secondary">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.schema.sampleData.map((row, i) => (
                  <tr key={i} className="border-b border-border-light">
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="px-md py-sm">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DatasetDetail;