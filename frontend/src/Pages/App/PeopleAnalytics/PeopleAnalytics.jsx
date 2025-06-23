import React, { useState } from 'react';

import ProductHeader from '../../../Components/App/_component/ProductHeader';
import ApiTestingCard from '../../../Components/App/_component/ApiTestingCard';
import {PeopleAnalyticsApis} from "../../../Constants/products"

export default function PeopleAnalytics() {
    
    const [expandedApi, setExpandedApi] = useState(null);
    const [loading, setLoading] = useState(null);
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});



    const handleApiClick = (apiKey) => {
        setExpandedApi(expandedApi === apiKey ? null : apiKey);
        if (expandedApi === apiKey) {
            // Clear results when collapsing
            setResults(prev => ({ ...prev, [apiKey]: null }));
            setErrors(prev => ({ ...prev, [apiKey]: null }));
        }
    };

    const handleFileChange = (apiKey, event) => {
        const file = event.target.files[0];
        if (file) {
            // Store file for API call
            setResults(prev => ({
                ...prev,
                [apiKey]: { ...prev[apiKey], file }
            }));
        }
    };

    const testApi = async (apiKey) => {
        const api = apis.endpoints[apiKey];
        const file = results[apiKey]?.file;

        if (!file) {
            setErrors(prev => ({
                ...prev,
                [apiKey]: "Please upload an image first"
            }));
            return;
        }

        setLoading(apiKey);
        setErrors(prev => ({ ...prev, [apiKey]: null }));

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${apis.url}${api.endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(prev => ({
                ...prev,
                [apiKey]: { ...prev[apiKey], response: data }
            }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [apiKey]: error.message || "Failed to test API"
            }));
        } finally {
            setLoading(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 mx-auto">

            <ProductHeader
                title="People Analytics API Testing"
                subtitle="Test and validate our AI-powered people analytics APIs with real-time results"
            />

            {/* API Cards Grid */}
            <ApiTestingCard
                apis={PeopleAnalyticsApis}
                handleApiClick={handleApiClick}
                handleFileChange={handleFileChange}
                testApi={testApi}
                copyToClipboard={copyToClipboard}
                expandedApi={expandedApi}
                results={results}
                loading={loading}
                errors={errors}
            />
        </div>
    );
}