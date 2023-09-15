import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const SingleDayGoldPrediction = () => {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [predictedPrice, setPredictedPrice] = useState<number>(NaN);
  const [formData, setFormData] = useState({
    GOLD_high: "",
    GOLD_low: "",
    GOLD_open: "",
    GDX_low: "",
    GDX_close: "",
    GDX_high: "",
    GDX_ajclose: "",
    GDX_open: "",
    SF_low: "",
    SF_price: "",
    SF_open: "",
    SF_high: "",
    EG_low: "",
    EG_open: "",
    EG_close: "",
    EG_high: "",
    EG_ajclose: "",
    PLT_price: "",
    PLT_high: "",
    PLT_low: "",
    PLT_open: "",
    OF_high: "",
    OF_price: "",
    OF_open: "",
    OF_low: "",
    SF_volume: "",
  });
  const fieldNames = [
    "GOLD_high",
    "GOLD_low",
    "GOLD_open",
    "GDX_low",
    "GDX_close",
    "GDX_high",
    "GDX_ajclose",
    "GDX_open",
    "SF_low",
    "SF_price",
    "SF_open",
    "SF_high",
    "EG_low",
    "EG_open",
    "EG_close",
    "EG_high",
    "EG_ajclose",
    "PLT_price",
    "PLT_high",
    "PLT_low",
    "PLT_open",
    "OF_high",
    "OF_price",
    "OF_open",
    "OF_low",
    "SF_volume",
  ];

  useEffect(() => {
    // Fetch available dates when the component loads
    axios
      .post("http://localhost:5000/get-available-dates")
      .then((response) => {
        setAvailableDates(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available dates:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const availableDateStrings = availableDates.map(
    (date) => new Date(date).toISOString().split("T")[0]
  );

  const handleDateChange = (e) => {
    const { value } = e.target;
    // Check if the selected date is in the availableDates array
    if (availableDateStrings.includes(value)) {
      setSelectedDate(value);
    } else {
      // Handle invalid date selection (e.g., show an error message)
      toast(
        "Information:\n1. Exist Dates: 15/12/2012 - 31/12/2018)\n2. No trading on holidays",
        {
          duration: 6000,
        }
      );
      toast.error("This day has no trading data");
      console.error("Invalid date selected:", value);
    }
  };

  const handleSetSampleFeatures = () => {
    // Make a request to fetch sample features for the selected date
    if (selectedDate) {
      axios
        .post(`http://localhost:5000/single-day/gold-sample-features`, {
          date: selectedDate,
        })
        .then((response) => {
          const { sample_features } = response.data;
          console.log("Sample Features:", sample_features);

          // Create a new object to update the formData state
          const updatedFormData = { ...formData };

          // Loop through the field names and update formData with sample_features values
          fieldNames.forEach((fieldName, index) => {
            updatedFormData[fieldName] = sample_features[index];
          });

          // Update the state with the new formData
          setFormData(updatedFormData);
          toast.success("Input complete!");
        })
        .catch((error) => {
          console.error("Error fetching sample features:", error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the form data to your Flask server
    axios
      .post("http://localhost:5000/single-day/gold", formData)
      .then((response) => {
        // Handle the response from the server
        const { data } = response; // Get the response data
        const { predicted_price, error } = data; // Destructure the data

        if (error) {
          console.error("Server error:", error);
          // Handle error appropriately, e.g., display an error message
        } else {
          console.log("Predicted price:", predicted_price);
          setPredictedPrice(predicted_price);
          toast.success("Price predicted!");
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        // Handle network error appropriately, e.g., display an error message
      });
  };

  const handleReset = () => {
    setFormData({
      GOLD_high: "",
      GOLD_low: "",
      GOLD_open: "",
      GDX_low: "",
      GDX_close: "",
      GDX_high: "",
      GDX_ajclose: "",
      GDX_open: "",
      SF_low: "",
      SF_price: "",
      SF_open: "",
      SF_high: "",
      EG_low: "",
      EG_open: "",
      EG_close: "",
      EG_high: "",
      EG_ajclose: "",
      PLT_price: "",
      PLT_high: "",
      PLT_low: "",
      PLT_open: "",
      OF_high: "",
      OF_price: "",
      OF_open: "",
      OF_low: "",
      SF_volume: "",
    });
    setPredictedPrice(NaN);
    setSelectedDate("");
    toast.success("Reset complete");
  };

  return (
    <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="px-4 py-4 border rounded border-gray-100">
        {" "}
        <h1 className="text-center ml-2 mb-3 text-xl font-bold tracking-wide text-gray-800">
          Gold Price: Single Day Prediction
        </h1>
        <hr className="mb-4"></hr>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
            {fieldNames.map((fieldName) => (
              <div key={fieldName}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-1"
                  htmlFor={fieldName}
                >
                  {fieldName.replace(/_/g, " ").toUpperCase()}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={fieldName}
                  type="number"
                  placeholder={`Enter ${fieldName
                    .replace(/_/g, " ")
                    .toUpperCase()}`}
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mb-8 border rounded border-gray-300 p-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="selectedDate"
            >
              <span className="text-red-500">(*Optional)</span> Auto Input Data
              from Existing Date:
            </label>
            <div className="grid gap-4 grid-cols-[7fr,3fr]">
              <input
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="selectedDate"
                type="date"
                name="selectedDate"
                value={selectedDate}
                onChange={handleDateChange}
                required
              />
              <button
                suppressHydrationWarning={true}
                type="button"
                onClick={handleSetSampleFeatures}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Set
              </button>
            </div>
          </div>
          <div className="mb-6">
            <button
              suppressHydrationWarning={true}
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Predict
            </button>
            <button
              suppressHydrationWarning={true}
              type="button"
              onClick={handleReset}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset
            </button>
          </div>
        </form>
        {!isNaN(predictedPrice) && (
          <div className="rounded-md bg-[#C4F9E2] p-4">
            <p
              suppressHydrationWarning={true}
              className="flex items-center text-sm font-medium text-[#004434]"
            >
              <span className="pr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                  <path
                    d="M9.18749 17.5V15.7083C8.45138 15.5417 7.81596 15.2222 7.28124 14.75C6.74652 14.2778 6.35416 13.6111 6.10416 12.75L7.64582 12.125C7.85416 12.7917 8.16318 13.2986 8.57291 13.6458C8.98263 13.9931 9.52082 14.1667 10.1875 14.1667C10.7569 14.1667 11.2396 14.0382 11.6354 13.7813C12.0312 13.5243 12.2292 13.125 12.2292 12.5833C12.2292 12.0972 12.0764 11.7118 11.7708 11.4271C11.4653 11.1424 10.7569 10.8194 9.64582 10.4583C8.45138 10.0833 7.63193 9.63542 7.18749 9.11458C6.74305 8.59375 6.52082 7.95833 6.52082 7.20833C6.52082 6.30556 6.81249 5.60417 7.39582 5.10417C7.97916 4.60417 8.57638 4.31944 9.18749 4.25V2.5H10.8542V4.25C11.5486 4.36111 12.1215 4.61458 12.5729 5.01042C13.0243 5.40625 13.3542 5.88889 13.5625 6.45833L12.0208 7.125C11.8542 6.68056 11.618 6.34722 11.3125 6.125C11.0069 5.90278 10.5903 5.79167 10.0625 5.79167C9.45138 5.79167 8.9861 5.92708 8.66666 6.19792C8.34721 6.46875 8.18749 6.80556 8.18749 7.20833C8.18749 7.66667 8.39582 8.02778 8.81249 8.29167C9.22916 8.55556 9.95138 8.83333 10.9792 9.125C11.9375 9.40278 12.6632 9.84375 13.1562 10.4479C13.6493 11.0521 13.8958 11.75 13.8958 12.5417C13.8958 13.5278 13.6042 14.2778 13.0208 14.7917C12.4375 15.3056 11.7153 15.625 10.8542 15.75V17.5H9.18749Z"
                    fill="white"
                  />
                </svg>
              </span>
              Predicted GOLD price : $
              <span className="font-bold">{predictedPrice.toFixed(6)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDayGoldPrediction;
