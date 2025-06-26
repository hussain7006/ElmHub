import React, { useState, useCallback, useMemo } from 'react';

import ProductHeader from '../../../../Components/App/Products/_components/ProductHeader';
import ApiTestingCard from '../../../../Components/App/Products/_components/ApiTestingCard';
import { PeopleAnalyticsApis } from "../../../../Constants/products"
import usePageSearch from '../../../../hooks/usePageSearch';
import useSearchStore from '../../../../store/searchStore';

export default function PeopleAnalytics() {

    const [expandedApi, setExpandedApi] = useState(null);
    const [loading, setLoading] = useState(null);
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});

    // Page-specific search function
    const searchPeopleAnalytics = useCallback(async (query) => {
        const searchTerm = query.toLowerCase().trim();
        const results = [];
        
        // Search through API endpoints
        Object.entries(PeopleAnalyticsApis.endpoints).forEach(([key, api]) => {
            const nameMatch = api.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = api.description.toLowerCase().includes(searchTerm);
            const keyMatch = key.toLowerCase().includes(searchTerm);
            
            if (nameMatch || descriptionMatch || keyMatch) {
                results.push({
                    id: key,
                    name: api.name,
                    description: api.description,
                    icon: api.icon,
                    color: api.color,
                    type: 'api',
                    relevance: nameMatch ? 0 : (keyMatch ? 1 : 2), // Name matches are most relevant
                    path: `/products/peopleanalytics#${key}`,
                    section: 'People Analytics APIs'
                });
            }
        });
        
        // Sort by relevance
        return results.sort((a, b) => a.relevance - b.relevance);
    }, []); // Empty dependency array since we're not using any external values

    // Register page search function
    usePageSearch(searchPeopleAnalytics);

    // Filter APIs based on search
    const { searchQuery, isFiltering } = useSearchStore();
    const filteredEndpoints = useMemo(() => {
        if (!isFiltering || !searchQuery.trim()) return PeopleAnalyticsApis.endpoints;
        const searchTerm = searchQuery.toLowerCase().trim();
        return Object.fromEntries(
            Object.entries(PeopleAnalyticsApis.endpoints).filter(([key, api]) =>
                api.name.toLowerCase().includes(searchTerm) ||
                api.description.toLowerCase().includes(searchTerm) ||
                key.toLowerCase().includes(searchTerm)
            )
        );
    }, [isFiltering, searchQuery]);

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
            // Store file for API call and clear previous response
            setResults(prev => ({
                ...prev,
                [apiKey]: { file, response: null }
            }));
            // Clear any errors for this API
            setErrors(prev => ({ ...prev, [apiKey]: null }));
        }
    };

    const testApi = async (apiKey) => {
        console.log("in testApi: ", apiKey);
        
        
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
            formData.append('file', file);
            console.log(`${PeopleAnalyticsApis.url}${PeopleAnalyticsApis.endpoints[apiKey].endpoint}`)
            const response = await fetch(`${PeopleAnalyticsApis.url}${PeopleAnalyticsApis.endpoints[apiKey].endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            
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
                apis={{ ...PeopleAnalyticsApis, endpoints: filteredEndpoints }}
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