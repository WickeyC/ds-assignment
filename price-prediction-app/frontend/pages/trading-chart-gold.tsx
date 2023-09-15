import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, Divider } from "@mui/material";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This disables server-side rendering for the component
});

export default function TradingChartGold() {
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
            data: goldChartData["chart_data"],
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
                x: new Date(goldChartData["predicted_date_range"][0]).getTime(),
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

  const [goldChartData, setGoldChartData] = useState([]);
  const [goldStartDate, setGoldStartDate] = useState<string>("2017-08-31");
  const [goldEndDate, setGoldEndDate] = useState<string>("2018-03-21");
  const [platinumEndDate, setPlatinumEndDate] = useState<string>("2018-12-31");
  const [silverEndDate, setSilverEndDate] = useState<string>("2018-12-31");

  useEffect(() => {
    // Function to fetch gold chart data
    const fetchGoldChartData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/trading-chart-gold",
          {
            start_date: goldStartDate,
            end_date: goldEndDate,
          }
        );

        const chartData = response.data;
        console.log(chartData);

        // Update the state with the fetched data
        setGoldChartData(chartData);
      } catch (error) {
        console.error("Error fetching gold chart data:", error);
        // Handle errors as needed
      }
    };

    // Call the fetchGoldChartData function when goldEndDate changes
    fetchGoldChartData();
  }, [goldStartDate, goldEndDate]);

  const handleGoldStartDateChange = (event) => {
    setGoldStartDate(event.target.value);
  };

  const handleGoldEndDateChange = (event) => {
    setGoldEndDate(event.target.value);
  };

  useEffect(() => {
    // Fetch and set your chart data here
  }, [platinumEndDate]);

  useEffect(() => {
    // Fetch and set your chart data here
  }, [silverEndDate]);

  const isChartDataAvailable = Array.isArray(goldChartData["chart_data"]);

  return (
    <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="px-4 py-4 border rounded border-gray-100">
        <h1 className="text-center ml-2 mb-3 text-xl font-bold tracking-wide text-gray-800">
          Gold Price: Prediction Chart
        </h1>
        <div className="mb-8 border rounded border-gray-300 p-4 grid gap-4 grid-cols-[5fr,5fr]">
          <div>
            {" "}
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="goldStartDate"
            >
              Start Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="goldStartDate"
              type="date"
              name="goldStartDate"
              value={goldStartDate}
              onChange={handleGoldStartDateChange}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="goldEndDate"
            >
              End Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="goldEndDate"
              type="date"
              name="goldEndDate"
              value={goldEndDate}
              onChange={handleGoldEndDateChange}
              required
            />
          </div>
        </div>
        {isChartDataAvailable && (
          <ApexChart options={{}} series={goldChartData["chart_data"]} />
        )}
      </div>
    </div>
  );
}
