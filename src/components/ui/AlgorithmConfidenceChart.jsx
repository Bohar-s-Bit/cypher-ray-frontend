import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';

const chartColors = ['#a855f7', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'];

const AlgorithmConfidenceChart = ({ data }) => {
  // Transform algorithm data to chart format
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((algo) => ({
      key: algo.algorithm_name || algo.name || 'Unknown',
      data: Math.round((algo.confidence_score || algo.confidence || 0) * 100),
      fullData: algo,
    }));
  }, [data]);

  // Calculate statistics
  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      height: Math.max(300, chartData.length * 50),
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetX: 30,
      style: {
        fontSize: '12px',
        fontWeight: '500',
        colors: ['#e2e8f0'],
      },
    },
    colors: chartColors,
    xaxis: {
      categories: chartData.map(d => d.key),
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: ['#e2e8f0'],
          fontSize: '12px',
        },
        maxWidth: 200,
        formatter: (val) => val.length > 20 ? `${val.slice(0, 20)}...` : val,
      },
    },
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  }), [chartData]);

  const chartSeries = useMemo(() => [{
    name: 'Confidence',
    data: chartData.map(d => d.data),
  }], [chartData]);

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        highConfidence: 0,
        averageConfidence: 0,
        highConfidencePercentage: 0,
      };
    }

    const highConfidenceAlgos = chartData.filter(f => f.data >= 80);
    const totalConfidence = chartData.reduce((sum, f) => sum + f.data, 0);
    const avgConfidence = Math.round(totalConfidence / chartData.length);

    return {
      highConfidence: highConfidenceAlgos.length,
      averageConfidence: avgConfidence,
      highConfidencePercentage: Math.round((highConfidenceAlgos.length / chartData.length) * 100),
    };
  }, [chartData]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        No algorithm data available
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between bg-black/20 border border-purple-500/30 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h3 className="text-2xl font-bold text-white">
          Algorithm Confidence Analysis
        </h3>
        <div className="text-sm text-white/60">
          {chartData.length} {chartData.length === 1 ? 'Algorithm' : 'Algorithms'}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-grow px-4 py-6 min-h-[300px] relative">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={Math.max(300, chartData.length * 50)}
        />
      </div>

      {/* Statistics */}
      <div className="flex w-full px-8 py-6 justify-between border-t border-white/10">
        <div className="flex flex-col gap-2 w-1/2">
          <span className="text-lg text-white/70">High Confidence Algorithms</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-4xl font-bold text-white">
              {stats.highConfidence}
            </span>
            <div className="flex bg-green-500/20 px-3 py-1 items-center rounded-full">
              <span className="text-green-400 font-semibold text-sm">
                ≥80%
              </span>
            </div>
          </div>
          <span className="text-white/50 text-sm">
            {stats.highConfidencePercentage}% of total algorithms
          </span>
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <span className="text-lg text-white/70">Average Confidence</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-4xl font-bold text-white">
              {stats.averageConfidence}%
            </span>
            <div className={`flex px-3 py-1 items-center rounded-full ${
              stats.averageConfidence >= 80 
                ? 'bg-green-500/20' 
                : stats.averageConfidence >= 60 
                  ? 'bg-purple-500/20' 
                  : 'bg-orange-500/20'
            }`}>
              <span className={`font-semibold text-sm ${
                stats.averageConfidence >= 80 
                  ? 'text-green-400' 
                  : stats.averageConfidence >= 60 
                    ? 'text-purple-400' 
                    : 'text-orange-400'
              }`}>
                {stats.averageConfidence >= 80 ? 'High' : stats.averageConfidence >= 60 ? 'Good' : 'Medium'}
              </span>
            </div>
          </div>
          <span className="text-white/50 text-sm">
            Across all detected algorithms
          </span>
        </div>
      </div>

      {/* Top Algorithms Details */}
      {chartData.length > 0 && (
        <div className="flex flex-col px-6 pb-6 pt-2 divide-y divide-white/10">
          <div className="text-sm font-semibold text-white/70 pb-3">
            Top Algorithms by Confidence
          </div>
          {chartData
            .sort((a, b) => b.data - a.data)
            .slice(0, 3)
            .map((algo, index) => (
              <motion.div
                key={algo.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex w-full py-3 items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-mono text-sm text-white truncate" title={algo.key}>
                    {algo.key}
                  </span>
                  {algo.fullData.algorithm_class && (
                    <span className="text-xs text-white/50 truncate">
                      {algo.fullData.algorithm_class}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-white">
                    {algo.data}%
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    algo.data >= 90 
                      ? 'bg-green-500' 
                      : algo.data >= 70 
                        ? 'bg-purple-500' 
                        : algo.data >= 50 
                          ? 'bg-blue-500' 
                          : 'bg-orange-500'
                  }`} />
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AlgorithmConfidenceChart;
