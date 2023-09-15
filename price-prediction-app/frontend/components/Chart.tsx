import React, { Component } from "react";
import dayjs from "dayjs"; // Import the date formatting library if not already imported
import Chart from "react-apexcharts";
import axios from "axios";
import dynamic from "next/dynamic";
const DynamicChart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // This disables server-side rendering for the component
});

interface ApexChartProps {
  goldChartData: any[]; // Adjust the type to match your data structure
  goldEndDate: string;
}

interface ApexChartState {
  goldChartData: any[]; // Adjust the type to match your data structure
  goldEndDate: string;
}

class ApexChart extends Component<ApexChartProps, ApexChartState> {
  constructor(props, goldChartData, goldEndDate) {
    super(props);

    this.state = {
      goldChartData: goldChartData,
      goldEndDate: goldEndDate,
    };
  }

  componentDidMount() {
    this.fetchGoldChartData();
  }

  async fetchGoldChartData() {
    const { goldEndDate } = this.state;

    try {
      const response = await axios.post(
        "http://localhost:5000/trading-chart-gold",
        {
          end_date: goldEndDate,
        }
      );

      const chartData = response.data;
      console.log(chartData);

      this.setState({ goldChartData: chartData });
    } catch (error) {
      console.error("Error fetching gold chart data:", error);
      // Handle errors as needed
    }
  }

  render() {
    const { goldChartData } = this.state;

    return (
      <div>
        <DynamicChart
          options={{
            chart: {
              height: 350,
              type: "candlestick",
            },
            title: {
              text: "Gold Price Prediction",
              align: "center",
            },
            annotations: {
              xaxis: [
                {
                  x: "1509926400000",
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
                    text: "Prediction Start Point",
                  },
                },
              ],
            },
            tooltip: {
              enabled: true,
              x: {
                format: "dd/MM/yyyy",
              },
            },
            xaxis: {
              type: "datetime",
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
            series: [
              {
                name: "OHLC",
                data: goldChartData["chart_data"].map((single_day) => ({
                  x: new Date(single_day[0]),
                  y: [
                    single_day[1],
                    single_day[2],
                    single_day[3],
                    single_day[4],
                  ],
                })),
              },
            ],
          }}
          series={[
            {
              name: "OHLC",
              data: goldChartData["chart_data"].map((single_day) => ({
                x: new Date(single_day[0]),
                y: [single_day[1], single_day[2], single_day[3], single_day[4]],
              })),
            },
          ]}
        />
      </div>
    );
  }
}

export default ApexChart;
