import { constants } from "../constants/constantsV3";

const mainBackendBaseUrl = constants.cam1IP;


export const searchPerson = async (selectedFile, topN, threshold) => {
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('top_n', topN);
        formData.append('threshold', threshold);

        const response = await fetch(`${mainBackendBaseUrl}/stream/upload`, {
            method: 'POST',
            body: formData,
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            return { success: false, error: errorData };
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
};



// export const searchPerson = async (selectedFile, topN, threshold) => {
//     var formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('top_n', topN);
//     formData.append('threshold', threshold);

//     const result  = await fetch(mainBackendBaseUrl + '/stream/upload', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.json())
//         .then(data => {

//             return { success: true, data: data }


//         })
//         .catch(error => {
//             console.error('Error:', error);
//             return { success: false, error: error }

//         });

//         return result;
// }