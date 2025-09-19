
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Hash, AlertTriangle, TrendingUp } from 'lucide-react';

// Import Chart.js components and the React wrapper
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Registering Chart.js components that we will use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
);

import reportsData from '../../utils/MockData/mockreport.json';
import postsData from '../../utils/MockData/mockPosts.json';



export default function Analytics() {

  // --- Chart Options (common settings for all charts) ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10 },
          boxWidth: 12,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      },
      y: {
        grid: { color: '#e7e5e4' },
        ticks: { font: { size: 10 } }
      }
    }
  };

  // --- Data Processing for Chart.js format ---
  const reportsByCategoryData = useMemo(() => {
    const counts = reportsData.reduce((acc, report) => {
      const category = report.ai_tags.classification;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Report Count',
        data: Object.values(counts),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }],
    };
  }, []);

  const reportsByUrgencyData = useMemo(() => {
    const counts = reportsData.reduce((acc, report) => {
      const urgency = report.ai_tags.urgency;
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Urgency',
        data: Object.values(counts),
        backgroundColor: ['#c4b5fd', '#a78bfa', '#7c3aed', '#4f46e5'],
        borderColor: '#ffffff',
        borderWidth: 2,
      }],
    };
  }, []);

  const reportsOverTimeData = useMemo(() => {
    const counts = reportsData.reduce((acc, report) => {
      const month = new Date(report.timestamp).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const sortedLabels = Object.keys(counts).sort((a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`));
    const sortedData = sortedLabels.map(label => counts[label]);

    return {
      labels: sortedLabels,
      datasets: [{
        label: 'Reports',
        data: sortedData,
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 1)',
        tension: 0.3, // Makes the line smooth
      }],
    };
  }, []);
  
  const hashtagEngagementData = useMemo(() => {
    const engagement = {};
    const hashtagRegex = /#\w+/g;
    postsData.forEach(post => {
      const hashtags = post.text.match(hashtagRegex);
      if (hashtags) {
        hashtags.forEach(hashtag => {
          if (!engagement[hashtag]) engagement[hashtag] = 0;
          engagement[hashtag] += (post.likes + post.retweets + post.replies);
        });
      }
    });
    const sorted = Object.entries(engagement).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      labels: sorted.map(item => item[0]),
      datasets: [{
        label: 'Total Engagement',
        data: sorted.map(item => item[1]),
        backgroundColor: 'rgba(167, 139, 250, 0.7)',
        borderColor: 'rgba(167, 139, 250, 1)',
        borderWidth: 1,
      }],
    };
  }, []);

  return (
    <motion.div 
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart2 className="mr-3 text-indigo-600" size={24} />
        Ocean Health Analytics
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graph 1: Bar Chart */}
        <div className="bg-gray-50/50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><BarChart2 size={16} className="mr-2"/>Reports by Classification</p>
          <div className="relative h-64">
             <Bar options={{...commonOptions, plugins: { legend: { display: false }}}} data={reportsByCategoryData} />
          </div>
        </div>

        {/* Graph 2: Pie Chart */}
        <div className="bg-gray-50/50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><AlertTriangle size={16} className="mr-2"/>Report Urgency Distribution</p>
          <div className="relative h-64">
            <Pie data={reportsByUrgencyData} options={{...commonOptions, plugins: {...commonOptions.plugins, legend: { position: 'right' }}}}/>
          </div>
        </div>

        {/* Graph 3: Area Chart (Line Chart with fill) */}
        <div className="bg-gray-50/50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><TrendingUp size={16} className="mr-2"/>Reports Over Time</p>
          <div className="relative h-64">
            <Line options={{...commonOptions, plugins: { legend: { display: false }}}} data={reportsOverTimeData} />
          </div>
        </div>
        
        {/* Graph 4: Horizontal Bar Chart */}
        <div className="bg-gray-50/50 p-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><Hash size={16} className="mr-2"/>Top Hashtag Engagement</p>
          <div className="relative h-64">
             <Bar 
              options={{
                ...commonOptions, 
                indexAxis: 'y', // This makes the bar chart horizontal
                scales: { x: { grid: { color: '#e7e5e4' } }, y: { grid: { display: false } } },
                plugins: { legend: { display: false } }
              }} 
              data={hashtagEngagementData} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// API INTEGRATED:


// import React, { useState, useEffect, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { BarChart2, Hash, AlertTriangle, TrendingUp, Loader, Inbox } from 'lucide-react';
// import { useParams } from 'react-router-dom';

// // Import Chart.js components and the React wrapper
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Filler,
// } from 'chart.js';
// import { Bar, Pie, Line } from 'react-chartjs-2';

// // Registering Chart.js components that we will use
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Filler
// );

// // FIX: Removed the problematic file import and inlined the mock data.
// // This mock data is kept for the 'Top Hashtag Engagement' chart, 
// // as there is no API endpoint for social media posts.
// const postsData = [
//     { "text": "Huge plastic waste accumulation spotted near the coast. Authorities need to act! #CleanSeas #OceanPollution", "likes": 150, "retweets": 75, "replies": 20 },
//     { "text": "Sad to see coral bleaching getting worse. We must do more. #CoralReef #ClimateAction", "likes": 200, "retweets": 120, "replies": 35 },
//     { "text": "Illegal fishing nets found abandoned. This harms marine life. #IllegalFishing #ProtectMarineLife", "likes": 90, "retweets": 40, "replies": 15 },
//     { "text": "Joined a beach cleanup today! Every little bit helps. #BeachCleanup #Volunteer #CleanSeas", "likes": 300, "retweets": 150, "replies": 50 },
//     { "text": "Reported an oil spill through the app. Hope it gets contained quickly. #OilSpill #OceanPollution", "likes": 120, "retweets": 90, "replies": 25 }
// ];


// export default function Analytics() {
//     const { userId } = useParams();
//     const [citizenReports, setCitizenReports] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!userId) {
//             setError("A user ID must be provided in the URL.");
//             setIsLoading(false);
//             return;
//         }

//         const fetchCitizenReports = async () => {
//             // setIsLoading(true);
//             // setError(null);
            
//             // // api
//             // // const apiUrl = `/list_citizen_reports/${userId}`;

//             try {
//             //     // get request
//             //     const response = await fetch(apiUrl);

//             //     const data = await response.json();
//             //     if (!response.ok) {
//             //         throw new Error(data.detail || `Server error: ${response.status}`);
//             //     }

//             //     setCitizenReports(data.citizen_reports || []);

//             console.log("fetched reports")

//             } catch (err) {
//                 console.error("Failed to fetch citizen reports:", err);
//                 setError(err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchCitizenReports();
//     }, [userId]);

//     // --- Chart Options (common settings for all charts) ---
//     const commonOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: { font: { size: 10 }, boxWidth: 12 }
//             }
//         },
//         scales: {
//             x: { grid: { display: false }, ticks: { font: { size: 10 } } },
//             y: { grid: { color: '#e7e5e4' }, ticks: { font: { size: 10 } } }
//         }
//     };

//     // --- Data Processing for Chart.js format ---
//     const reportsByCategoryData = useMemo(() => {
//         const counts = citizenReports.reduce((acc, report) => {
//             const category = report.ai_tags.classification;
//             acc[category] = (acc[category] || 0) + 1;
//             return acc;
//         }, {});
//         return {
//             labels: Object.keys(counts),
//             datasets: [{
//                 label: 'Report Count',
//                 data: Object.values(counts),
//                 backgroundColor: 'rgba(79, 70, 229, 0.7)',
//                 borderColor: 'rgba(79, 70, 229, 1)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//             }],
//         };
//     }, [citizenReports]);

//     const reportsByUrgencyData = useMemo(() => {
//         const counts = citizenReports.reduce((acc, report) => {
//             const urgency = report.ai_tags.urgency;
//             acc[urgency] = (acc[urgency] || 0) + 1;
//             return acc;
//         }, {});
//         return {
//             labels: Object.keys(counts),
//             datasets: [{
//                 label: 'Urgency',
//                 data: Object.values(counts),
//                 backgroundColor: ['#fecaca', '#fb923c', '#facc15', '#93c5fd'],
//                 borderColor: '#ffffff',
//                 borderWidth: 2,
//             }],
//         };
//     }, [citizenReports]);

//     const reportsOverTimeData = useMemo(() => {
//         const counts = citizenReports.reduce((acc, report) => {
//             const month = new Date(report.timestamp).toLocaleString('default', { month: 'short', year: '2-digit' });
//             acc[month] = (acc[month] || 0) + 1;
//             return acc;
//         }, {});
//         const sortedLabels = Object.keys(counts).sort((a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`));
//         const sortedData = sortedLabels.map(label => counts[label]);

//         return {
//             labels: sortedLabels,
//             datasets: [{
//                 label: 'Reports',
//                 data: sortedData,
//                 fill: true,
//                 backgroundColor: 'rgba(124, 58, 237, 0.2)',
//                 borderColor: 'rgba(124, 58, 237, 1)',
//                 tension: 0.3,
//             }],
//         };
//     }, [citizenReports]);
    
//     const hashtagEngagementData = useMemo(() => {
//         const engagement = {};
//         const hashtagRegex = /#\w+/g;
//         postsData.forEach(post => {
//             const hashtags = post.text.match(hashtagRegex);
//             if (hashtags) {
//                 hashtags.forEach(hashtag => {
//                     if (!engagement[hashtag]) engagement[hashtag] = 0;
//                     engagement[hashtag] += (post.likes + post.retweets + post.replies);
//                 });
//             }
//         });
//         const sorted = Object.entries(engagement).sort((a, b) => b[1] - a[1]).slice(0, 5);
//         return {
//             labels: sorted.map(item => item[0]),
//             datasets: [{
//                 label: 'Total Engagement',
//                 data: sorted.map(item => item[1]),
//                 backgroundColor: 'rgba(167, 139, 250, 0.7)',
//                 borderColor: 'rgba(167, 139, 250, 1)',
//                 borderWidth: 1,
//             }],
//         };
//     }, []);

//     const renderCharts = () => {
//         if (isLoading) {
//             return (
//                 <div className="flex flex-col items-center justify-center text-gray-500 h-[34rem]">
//                     <Loader className="animate-spin text-indigo-500 mb-4" size={40} />
//                     <p className="font-semibold">Loading Analytics...</p>
//                 </div>
//             );
//         }

//         if (error) {
//             return (
//                 <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 p-6 rounded-lg h-[34rem]">
//                     <AlertTriangle className="mb-4" size={40} />
//                     <p className="font-bold">Could not load analytics data</p>
//                     <p className="text-sm font-mono mt-2">{error}</p>
//                 </div>
//             );
//         }

//         if (citizenReports.length === 0) {
//             return (
//                 <div className="flex flex-col items-center justify-center text-gray-500 h-[34rem]">
//                     <Inbox className="mb-4" size={40} />
//                     <p className="font-semibold">No Citizen Report Data Available</p>
//                     <p className="text-sm">Cannot generate analytics without reports.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Reports by Classification */}
//                 <div className="bg-gray-50/50 p-4 rounded-xl">
//                     <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><BarChart2 size={16} className="mr-2"/>Reports by Classification</p>
//                     <div className="relative h-64">
//                         <Bar options={{...commonOptions, plugins: { legend: { display: false }}}} data={reportsByCategoryData} />
//                     </div>
//                 </div>

//                 {/* Report Urgency Distribution */}
//                 <div className="bg-gray-50/50 p-4 rounded-xl">
//                     <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><AlertTriangle size={16} className="mr-2"/>Report Urgency Distribution</p>
//                     <div className="relative h-64">
//                         <Pie data={reportsByUrgencyData} options={{...commonOptions, plugins: {...commonOptions.plugins, legend: { position: 'right' }}}}/>
//                     </div>
//                 </div>

//                 {/* Reports Over Time */}
//                 <div className="bg-gray-50/50 p-4 rounded-xl">
//                     <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><TrendingUp size={16} className="mr-2"/>Reports Over Time</p>
//                     <div className="relative h-64">
//                         <Line options={{...commonOptions, plugins: { legend: { display: false }}}} data={reportsOverTimeData} />
//                     </div>
//                 </div>
                
//                 {/* Top Hashtag Engagement */}
//                 <div className="bg-gray-50/50 p-4 rounded-xl">
//                     <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center"><Hash size={16} className="mr-2"/>Top Hashtag Engagement</p>
//                     <div className="relative h-64">
//                         <Bar 
//                             options={{
//                                 ...commonOptions, 
//                                 indexAxis: 'y',
//                                 scales: { x: { grid: { color: '#e7e5e4' } }, y: { grid: { display: false } } },
//                                 plugins: { legend: { display: false } }
//                             }} 
//                             data={hashtagEngagementData} 
//                         />
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <motion.div 
//             className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//         >
//             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
//                 <BarChart2 className="mr-3 text-indigo-600" size={24} />
//                 Citizen Report Analytics
//             </h3>
//             {renderCharts()}
//         </motion.div>
//     );
// }
