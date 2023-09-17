import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This disables server-side rendering for the component
});

export default function TradingChartSilver() {
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
            data: silverChartData["chart_data"],
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
                  silverChartData["predicted_date_range"][0]
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

  const [silverChartData, setSilverChartData] = useState([]);
  const [silverStartDate, setSilverStartDate] = useState<string>("2017-08-31");
  const [silverEndDate, setSilverEndDate] = useState<string>("2018-03-21");

  useEffect(() => {
    // Function to fetch chart data
    const fetchSilverChartData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/trading-chart-silver",
          {
            start_date: silverStartDate,
            end_date: silverEndDate,
          }
        );

        const chartData = response.data;
        console.log(chartData);
        if (chartData["error"] !== undefined) {
          toast.error(chartData["error"]);
        }

        // Update the state with the fetched data
        setSilverChartData(chartData);
      } catch (error) {
        console.error("Error fetching silver chart data:", error);
        // Handle errors as needed
        toast.error("Error fetching data");
      }
    };

    fetchSilverChartData();
  }, [silverStartDate, silverEndDate]);

  const handleSilverStartDateChange = (event) => {
    setSilverStartDate(event.target.value);
  };

  const handleSilverEndDateChange = (event) => {
    setSilverEndDate(event.target.value);
  };

  const isChartDataAvailable = Array.isArray(silverChartData["chart_data"]);

  return (
    <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="px-4 py-4 border rounded border-gray-100">
        <h1 className="text-center ml-2 mb-3 text-xl font-bold tracking-wide text-gray-800">
          Silver Price: Prediction Chart
        </h1>
        <div className="mb-8 border rounded border-gray-300 p-4 grid gap-4 grid-cols-[5fr,5fr]">
          <div>
            {" "}
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="silverStartDate"
            >
              Start Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="silverStartDate"
              type="date"
              name="silverStartDate"
              value={silverStartDate}
              onChange={handleSilverStartDateChange}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="silverEndDate"
            >
              End Date:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="silverEndDate"
              type="date"
              name="silverEndDate"
              value={silverEndDate}
              onChange={handleSilverEndDateChange}
              required
            />
          </div>
        </div>
        {isChartDataAvailable && (
          <ApexChart options={{}} series={silverChartData["chart_data"]} />
        )}
      </div>
    </div>
  );
}
