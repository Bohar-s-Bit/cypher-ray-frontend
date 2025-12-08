import React from 'react';

const ConfidenceBarChart = ({ data }) => {
  // Calculate max confidence for percentage calculation
  const maxConfidence = 100;

  // Color coding based on confidence level (matching admin dashboard style)
  const getBarColor = (confidence) => {
    if (confidence >= 90) return 'from-green-500 to-green-600'; // high confidence
    if (confidence >= 70) return 'from-purple-500 to-purple-600'; // medium-high
    if (confidence >= 50) return 'from-blue-500 to-blue-600'; // medium
    return 'from-orange-500 to-orange-600'; // low confidence
  };

  return (
    <div className="space-y-3">
      {data.map((func, index) => {
        const confidence = Math.round((func.confidence || func.confidence_score || 0) * 100);
        const percentage = (confidence / maxConfidence) * 100;
        const functionName = func.name || func.function_name || 'Unknown';

        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-white/90 font-mono">
                {functionName}
              </span>
              <span className="text-sm font-semibold text-white">
                {confidence}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-8">
              <div
                className={`bg-gradient-to-r ${getBarColor(confidence)} h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              >
                {percentage > 15 && `${confidence}%`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConfidenceBarChart;
