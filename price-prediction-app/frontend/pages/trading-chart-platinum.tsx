import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This disables server-side rendering for the component
});

export default function TradingChartPlatinum() {
  interface ApexChartProps {
    options: any; // Adjust the type to match your data structure
    series: any;
  }

  interface ApexChartState {
    options: any; // Adjust the type to match your data structure
    series: any;
  }

  class ApexChart extends React.Component<ApexChartProps, ApexChartState> {
    constructor(props) {
      super(props);

      this.state = {
        series: [
          {
            name: "candle",
            data: platinumChartData["chart_data"],
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "candlestick",
          },
          annotations: {
            xaxis: [
              {
                x: new Date(
                  platinumChartData["predicted_date_range"][0]
                ).getTime(),
                borderColor: "#00E396",
                label: {
                  borderColor: "#00E396",
                  style: {
                    fontSize: "12px",
                    color: "#fff",
                    background: "#00E396",
                  },
                  orientation: "horizontal",
                  offsetY: 7,
                  text: "Prediction Start Date",
                },
              },
            ],
          },
          tooltip: {
            enabled: true,
            x: { show: true, format: "dd-MM-yyyy" },
          },
          xaxis: {
            type: "datetime",
            labels: {
              formatter: function (val) {
                return dayjs(val).format("DD-MM-YYYY");
              },
            },
          },
          yaxis: {
            tooltip: {
              enabled: true,
            },
            labels: {
              formatter: function (value) {
                return value.toFixed(1); // Format to six decimal places
              },
            },
          },
        },
      };
    }

    render() {
      return (
        <div id="chart">
          <DynamicChart
            options={this.state.options}
            series={this.state.series}
            type="candlestick"
            height={500}
          />
        </div>
      );
    }
  }

  const [platinumChartData, setPlatinumChartData] = useState([]);
  const [platinumStartDate, setPlatinumStartDate] =
    useState<string>("2017-08-31");
  const [platinumEndDate, setPlatinumEndDate] = useState<string>("2018-03-21");

  useEffect(() => {
    // Function to fetch chart data
    const fetchPlatinumChartData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/trading-chart-platinum",
          {
            start_date: platinumStartDate,
            end_date: platinumEndDate,
          }
        );

        const chartData = response.data;
        console.log(chartData);
        if (chartData["error"] !== undefined) {
          toast.error(chartData["error"]);
        }

        // Update the state with the fetched data
        setPlatinumChartData(chartData);
      } catch (error) {
        console.error("Error fetching platinum chart data:", error);
        // Handle errors as needed
        toast.error("Error fetching data");
      }
    };

    fetchPlatinumChartData();
  }, [platinumStartDate, platinumEndDate]);

  const handlePlatinumStartDateChange = (event) => {
    setPlatinumStartDate(event.target.value);
  };

  const handlePlatinumEndDateChange = (event) => {
    setPlatinumEndDate(event.target.value);
  };

  const isChartDataAvailable = Array.isArray(platinumChartData["chart_data"]);

  return (
    <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="px-4 py-4 border rounded border-gray-100">
        <h1 className="text-center ml-2 mb-3 text-xl font-bold tracking-wide text-gray-800">
          Platinum Price: Prediction Chart
        </h1>
        <div className="mb-8 border rounded border-gray-300 p-4 grid gap-4 grid-cols-[5fr,5fr]">
          <div>
            {" "}
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="platinumStartDate"
            >
              Start Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="platinumStartDate"
              type="date"
              name="platinumStartDate"
              value={platinumStartDate}
              onChange={handlePlatinumStartDateChange}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="platinumEndDate"
            >
              End Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="platinumEndDate"
              type="date"
              name="platinumEndDate"
              value={platinumEndDate}
              onChange={handlePlatinumEndDateChange}
              required
            />
          </div>
        </div>
        {isChartDataAvailable && (
          <ApexChart options={{}} series={platinumChartData["chart_data"]} />
        )}
      </div>
    </div>
  );
}
