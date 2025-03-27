// src/features/reporting/pages/CreateReportPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import reportService from '../services/reportService';
import promptService from '../../prompt/services/promptService';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Loading from '../../shared/ui/Loading';
import Alert from '../../shared/ui/Alert';
import DynamicDashboard from '../components/DynamicDashboard';

const CreateReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const promptId = queryParams.get('promptId');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [promptData, setPromptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prompt data on component mount
  useEffect(() => {
    const fetchPromptData = async () => {
      if (!promptId) {
        setError('No prompt ID provided. Please start from an analysis.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await promptService.getPromptResults(promptId);

        // Set prompt data
        setPromptData(response.data);

        // Set default report name based on prompt
        const promptResponse = await promptService.getPrompt(promptId);

        // Create a default report name based on the prompt text
        let defaultName = promptResponse.data.prompt;
        if (defaultName.length > 50) {
          defaultName = defaultName.substring(0, 50) + '...';
        }

        // Add "Report:" prefix
        setName('Report: ' + defaultName);
      } catch (err) {
        console.error('Error loading prompt data:', err);
        setError(err.message || 'Failed to load prompt data');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptData();
  }, [promptId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a report name');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Create the report
      const reportData = {
        name,
        description,
        promptId,
        code: promptData.code || null,
        data: promptData.data || null,
        visualizations: promptData.visualizations || [],
        insights: promptData.insights || [],
      };

      const response = await reportService.createReport(reportData);

      // Redirect to the new report page
      navigate(`/reports/${response.data.report.id}`);
    } catch (err) {
      console.error('Error creating report:', err);
      setError(err.message || 'Failed to create report');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-xl">
        <Loading text="Loading prompt data..." />
      </div>
    );
  }

  return (
    <div className="create-report-page">
      <PageHeader
        title="Save Report"
        subtitle="Save your analysis as a report that you can access later"
        backLink={
          <Button
            variant="ghost"
            as={Link}
            to="/prompt"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Back to Analysis
          </Button>
        }
      />

      {error && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Card className="mb-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <Input
              label="Report Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this report"
              required
            />
          </div>

          <div className="mb-lg">
            <Input
              label="Description (Optional)"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description of what this report contains"
              as="textarea"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-sm">
            <Button
              variant="ghost"
              as={Link}
              to="/prompt"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              Save Report
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview */}
      {promptData && (
        <div className="report-preview">
          <h2 className="text-lg font-semibold mb-md">Preview</h2>
          <Card className="p-0 overflow-hidden">
            <DynamicDashboard
              code={promptData.code}
              data={{
                visualizations: promptData.visualizations,
                insights: promptData.insights,
                ...promptData.data
              }}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateReportPage;