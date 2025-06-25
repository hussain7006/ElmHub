import React, { useState } from 'react';

// import useThemeStore from '../../../store/themeStore';
import ProductHeader from '../../../../Components/App/Products/_components/ProductHeader';
import ApiTestingCard from '../../../../Components/App/Products/_components/ApiTestingCard';
import { ExaminationCenterApis } from '../../../../Constants/products';

export default function ExaminationCenter() {
    const [expandedApi, setExpandedApi] = useState(null);
    const [loading, setLoading] = useState(null);
    const [results, setResults] = useState({});
    const [errors, setErrors] = useState({});



    const handleApiClick = (apiKey) => {
        console.log("in handleApiClick")
        setExpandedApi(expandedApi === apiKey ? null : apiKey);
        if (expandedApi === apiKey) {
            // Clear results when collapsing
            setResults(prev => ({ ...prev, [apiKey]: null }));
            setErrors(prev => ({ ...prev, [apiKey]: null }));
        }
    };

    const handleFileChange = (apiKey, event) => {
        console.log("in handleFileChange")
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

    const handleSubmit = async (apiKey) => {
        // apiKey = "head/standing/mobile/idCard/waterBottle/keyPoint"
        console.log("examinationCenter: in handleSubmit")

        const api = ExaminationCenterApis.endpoints[apiKey];
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
            console.log(`${ExaminationCenterApis.url}${ExaminationCenterApis.endpoints[apiKey].endpoint}`)
            const response = await fetch(`${ExaminationCenterApis.url}${ExaminationCenterApis.endpoints[apiKey].endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("data", data);
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
                title="Examination Center API Testing"
                subtitle="Test and validate our AI-powered detection APIs with real-time results"
            />

            {/* API Cards Grid */}
            <ApiTestingCard
                apis={ExaminationCenterApis}
                handleApiClick={handleApiClick}
                handleFileChange={handleFileChange}
                testApi={handleSubmit}
                copyToClipboard={copyToClipboard}
                expandedApi={expandedApi}
                results={results}
                loading={loading}
                errors={errors}
            />
        </div>
    );
}