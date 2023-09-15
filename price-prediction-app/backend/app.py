from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
import warnings
# Disable all warnings
warnings.filterwarnings("ignore")

gold_price_path = '../../processed_price_gold.csv'
platinum_price_path = '../../processed_price_platinum.csv'
silver_price_path = '../../processed_price_silver.csv'

gold_price = pd.read_csv(gold_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)
platinum_price = pd.read_csv(platinum_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)
silver_price = pd.read_csv(silver_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)

print('---------------------')
print("Done reading files")
scaler = MinMaxScaler()
tscv = TimeSeriesSplit(n_splits=5)

# GOLD PREPROCESSING
gold_ajclose_corr = gold_price.corrwith(gold_price['GOLD_ajclose'])
gold_ajclose_corr_df = gold_ajclose_corr.to_frame(name='Correlation with GOLD_ajclose')
gold_ajclose_corr_df = gold_ajclose_corr_df.drop('GOLD_ajclose').sort_values(
                       by='Correlation with GOLD_ajclose', ascending=False)
high_corr_features = gold_ajclose_corr_df[gold_ajclose_corr_df['Correlation with GOLD_ajclose'] > 0.7].index.tolist()
y_gold = gold_price['GOLD_ajclose']
X_gold = gold_price[high_corr_features]
X_gold = X_gold.drop(columns=['GOLD_close'])
for train_index, test_index in tscv.split(X_gold):
    X_gold_train, X_gold_test = X_gold.iloc[train_index], X_gold.iloc[test_index]
    y_gold_train, y_gold_test = y_gold.iloc[train_index], y_gold.iloc[test_index]
X_gold_train_scaled = scaler.fit_transform(X_gold_train)
X_gold_test_scaled = scaler.transform(X_gold_test)
X_gold_train_scaled = pd.DataFrame(X_gold_train_scaled, columns=X_gold_train.columns, index=X_gold_train.index)
X_gold_test_scaled = pd.DataFrame(X_gold_test_scaled, columns=X_gold_test.columns, index=X_gold_test.index)
lr_gold_model = LinearRegression(n_jobs=-1)
lr_gold_model.fit(X_gold_train_scaled, y_gold_train)

# PLATINUM PREPROCESSING
platinum_ajclose_corr = platinum_price.corrwith(platinum_price['PLT_price'])
platinum_ajclose_corr_df = platinum_ajclose_corr.to_frame(name='Correlation with PLT_price')
platinum_ajclose_corr_df = platinum_ajclose_corr_df.drop('PLT_price').sort_values(
                       by='Correlation with PLT_price', ascending=False)
high_corr_features = platinum_ajclose_corr_df[platinum_ajclose_corr_df['Correlation with PLT_price'] > 0.7].index.tolist()
y_platinum = platinum_price['PLT_price']
X_platinum = platinum_price[high_corr_features]
for train_index, test_index in tscv.split(X_platinum):
    X_platinum_train, X_platinum_test = X_platinum.iloc[train_index], X_platinum.iloc[test_index]
    y_platinum_train, y_platinum_test = y_platinum.iloc[train_index], y_platinum.iloc[test_index]
X_platinum_train_scaled = scaler.fit_transform(X_platinum_train)
X_platinum_test_scaled = scaler.transform(X_platinum_test)
X_platinum_train_scaled = pd.DataFrame(X_platinum_train_scaled, columns=X_platinum_train.columns, index=X_platinum_train.index)
X_platinum_test_scaled = pd.DataFrame(X_platinum_test_scaled, columns=X_platinum_test.columns, index=X_platinum_test.index)
lr_platinum_model = LinearRegression(n_jobs=-1)
lr_platinum_model.fit(X_platinum_train_scaled, y_platinum_train)

# SILVER PREPROCESSING

silver_ajclose_corr = silver_price.corrwith(silver_price['SF_price'])
silver_ajclose_corr_df = silver_ajclose_corr.to_frame(name='Correlation with SF_price')
silver_ajclose_corr_df = silver_ajclose_corr_df.drop('SF_price').sort_values(
                       by='Correlation with SF_price', ascending=False)
high_corr_features = silver_ajclose_corr_df[silver_ajclose_corr_df['Correlation with SF_price'] > 0.7].index.tolist()
y_silver = silver_price['SF_price']
X_silver = silver_price[high_corr_features]
for train_index, test_index in tscv.split(X_silver):
    X_silver_train, X_silver_test = X_silver.iloc[train_index], X_silver.iloc[test_index]
    y_silver_train, y_silver_test = y_silver.iloc[train_index], y_silver.iloc[test_index]
X_silver_train_scaled = scaler.fit_transform(X_silver_train)
X_silver_test_scaled = scaler.transform(X_silver_test)
X_silver_train_scaled = pd.DataFrame(X_silver_train_scaled, columns=X_silver_train.columns, index=X_silver_train.index)
X_silver_test_scaled = pd.DataFrame(X_silver_test_scaled, columns=X_silver_test.columns, index=X_silver_test.index)
lr_silver_model = LinearRegression(n_jobs=-1)
lr_silver_model.fit(X_silver_train_scaled, y_silver_train)

def get_available_date():
    return (gold_price.index).tolist()

def gold_price_prediction_single_day(GOLD_high, GOLD_low, GOLD_open, GDX_low,
                                     GDX_close, GDX_high, GDX_ajclose, GDX_open,
                                     SF_low, SF_price, SF_open, SF_high, EG_low,
                                     EG_open, EG_close, EG_high, EG_ajclose,
                                     PLT_price, PLT_high, PLT_low, PLT_open,
                                     OF_high, OF_price, OF_open, OF_low, SF_volume):
    # Create a DataFrame with the input features
    input_data = pd.DataFrame({
        'GOLD_high': [GOLD_high],
        'GOLD_low': [GOLD_low],
        'GOLD_open': [GOLD_open],
        'GDX_low': [GDX_low],
        'GDX_close': [GDX_close],
        'GDX_high': [GDX_high],
        'GDX_ajclose': [GDX_ajclose],
        'GDX_open': [GDX_open],
        'SF_low': [SF_low],
        'SF_price': [SF_price],
        'SF_open': [SF_open],
        'SF_high': [SF_high],
        'EG_low': [EG_low],
        'EG_open': [EG_open],
        'EG_close': [EG_close],
        'EG_high': [EG_high],
        'EG_ajclose': [EG_ajclose],
        'PLT_price': [PLT_price],
        'PLT_high': [PLT_high],
        'PLT_low': [PLT_low],
        'PLT_open': [PLT_open],
        'OF_high': [OF_high],
        'OF_price': [OF_price],
        'OF_open': [OF_open],
        'OF_low': [OF_low],
        'SF_volume': [SF_volume]
    })

    # Scale the input data
    input_data_scaled = scaler.transform(input_data)
    input_data_scaled = pd.DataFrame(input_data_scaled, columns=input_data.columns)

    # Make predictions using the linear regression model
    predicted_price = lr_gold_model.predict(input_data_scaled)

    return predicted_price[0]  # Return the predicted gold price for the single day

def gold_price_prediction_date_range(startDate, endDate):
    # Convert the input endDate to a Timestamp object
    startDate = pd.Timestamp(startDate)
    endDate = pd.Timestamp(endDate)

    available_dates = X_gold_test_scaled.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the dates
    if (startDate >= first_available_date or startDate > endDate):
        return {'error': 'startDate is same or later than the first available prediction date.'}
    if endDate < first_available_date:
        return {'error': 'endDate is earlier than the first available date.'}
    elif endDate > last_available_date:
        return {'error': 'endDate is later than the last available date.'}

    # limit the predicted date range
    predicted_date_range = available_dates[available_dates <= endDate]
    
    # Only the date range before and including the end date
    X_gold_test_scaled_filtered = X_gold_test_scaled[X_gold_test_scaled.index <= endDate]
    
    # Make predictions using the linear regression model for the filtered date range
    predicted_prices = lr_gold_model.predict(X_gold_test_scaled_filtered)
    
    # Create a Series for predicted prices with the filtered date range
    predicted_ajclose = pd.Series(predicted_prices, index=predicted_date_range)
    
    # Concatenate the 'GOLD_ajclose' values
    offset_day = predicted_date_range[0] - pd.DateOffset(days=1)
    gold_ajclose_before_prediction = gold_price['GOLD_ajclose'][startDate:offset_day]
    combined_ajclose = pd.concat([gold_ajclose_before_prediction, predicted_ajclose])
    
    gold_price_filtered = gold_price.loc[gold_price.index <= available_dates.max()]
    gold_price_filtered = gold_price_filtered.loc[gold_price_filtered.index >= startDate]
    
    # Create the chart_data list by iterating over the data
    chart_date_range = gold_price.index[(gold_price.index >= startDate) & (gold_price.index <= endDate)]

    chart_data = []
    for date, ajclose in zip(chart_date_range, combined_ajclose):
        timestamp = int(date.timestamp()) * 1000  # Convert to milliseconds
        open_price = gold_price_filtered.at[date, 'GOLD_open']
        high_price = gold_price_filtered.at[date, 'GOLD_high']
        low_price = gold_price_filtered.at[date, 'GOLD_low']
        chart_data.append([timestamp, open_price, high_price, low_price, ajclose])

    return {
        'predicted_price': predicted_prices.tolist(),
        'predicted_date_range': predicted_date_range.tolist(),
        'combined_ajclose': combined_ajclose.tolist(),
        'chart_data': chart_data
    }

def get_gold_price_sample_features(date):
    # Convert the input date to a Timestamp object
    date = pd.Timestamp(date)

    available_dates = X_gold.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the date
    if date < first_available_date:
        return {'error': 'Date is earlier than the first available date.'}
    elif date > last_available_date:
        return {'error': 'Date is later than the last available date.'}
    
    try:
        # Get the features for the specified date
        features = X_gold.loc[date].tolist()
        return features
    except KeyError:
        return {'error': 'Data not available for the specified date.'}

def platinum_price_prediction_single_day(PLT_high,PLT_low,PLT_open,USO_high,USO_ajclose,USO_close,
                                         USO_open,USO_low,EG_ajclose,EG_low,EG_close,EG_open,
                                         EG_high,OF_high,OF_price,OF_open,OF_low,OS_high,OS_open,
                                         OS_price,OS_low,EU_high,EU_price,EU_open,EU_low,SF_high,
                                         SF_price,SF_open,SF_low,GOLD_high,GOLD_ajclose,GOLD_close,
                                         GOLD_open,GOLD_low,GDX_high,GDX_open,GDX_close,
                                         GDX_low,GDX_ajclose):
    # Create a DataFrame with the input features
    input_data = pd.DataFrame({
        'PLT_high': [PLT_high],
        'PLT_low': [PLT_low],
        'PLT_open': [PLT_open],
        'USO_high': [USO_high],
        'USO_ajclose': [USO_ajclose],
        'USO_close': [USO_close],
        'USO_open': [USO_open],
        'USO_low': [USO_low],
        'EG_ajclose': [EG_ajclose],
        'EG_low': [EG_low],
        'EG_close': [EG_close],
        'EG_open': [EG_open],
        'EG_high': [EG_high],
        'OF_high': [OF_high],
        'OF_price': [OF_price],
        'OF_open': [OF_open],
        'OF_low': [OF_low],
        'OS_high': [OS_high],
        'OS_open': [OS_open],
        'OS_price': [OS_price],
        'OS_low': [OS_low],
        'EU_high': [EU_high],
        'EU_price': [EU_price],
        'EU_open': [EU_open],
        'EU_low': [EU_low],
        'SF_high': [SF_high],
        'SF_price': [SF_price],
        'SF_open': [SF_open],
        'SF_low': [SF_low],
        'GOLD_high': [GOLD_high],
        'GOLD_ajclose': [GOLD_ajclose],
        'GOLD_close': [GOLD_close],
        'GOLD_open': [GOLD_open],
        'GOLD_low': [GOLD_low],
        'GDX_high': [GDX_high],
        'GDX_open': [GDX_open],
        'GDX_close': [GDX_close],
        'GDX_low': [GDX_low],
        'GDX_ajclose': [GDX_ajclose],
    })

    # Scale the input data
    input_data_scaled = scaler.transform(input_data)
    input_data_scaled = pd.DataFrame(input_data_scaled, columns=input_data.columns)

    # Make predictions using the linear regression model
    predicted_price = lr_platinum_model.predict(input_data_scaled)

    return predicted_price[0]  # Return the predicted gold price for the single day

def platinum_price_prediction_date_range(startDate, endDate):
    # Convert the input endDate to a Timestamp object
    startDate = pd.Timestamp(startDate)
    endDate = pd.Timestamp(endDate)

    available_dates = X_platinum_test_scaled.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the dates
    if (startDate >= first_available_date or startDate > endDate):
        return {'error': 'startDate is same or later than the first available prediction date.'}
    if endDate < first_available_date:
        return {'error': 'endDate is earlier than the first available date.'}
    elif endDate > last_available_date:
        return {'error': 'endDate is later than the last available date.'}

    # limit the predicted date range
    predicted_date_range = available_dates[available_dates <= endDate]
    
    # Only the date range before and including the end date
    X_platinum_test_scaled_filtered = X_platinum_test_scaled[X_platinum_test_scaled.index <= endDate]
    
    # Make predictions using the linear regression model for the filtered date range
    predicted_prices = lr_platinum_model.predict(X_platinum_test_scaled_filtered)
    
    # Create a Series for predicted prices with the filtered date range
    predicted_ajclose = pd.Series(predicted_prices, index=predicted_date_range)
    
    # Concatenate the 'PLT_price' values
    offset_day = predicted_date_range[0] - pd.DateOffset(days=1)
    plt_price_before_prediction = platinum_price['PLT_price'][startDate:offset_day]
    combined_ajclose = pd.concat([plt_price_before_prediction, predicted_ajclose])
    
    platinum_price_filtered = platinum_price.loc[platinum_price.index <= available_dates.max()]
    platinum_price_filtered = platinum_price_filtered.loc[platinum_price_filtered.index >= startDate]
    
    # Create the chart_data list by iterating over the data
    chart_date_range = platinum_price.index[(platinum_price.index >= startDate) & (platinum_price.index <= endDate)]

    chart_data = []
    for date, ajclose in zip(chart_date_range, combined_ajclose):
        timestamp = int(date.timestamp()) * 1000  # Convert to milliseconds
        open_price = platinum_price_filtered.at[date, 'PLT_open']
        high_price = platinum_price_filtered.at[date, 'PLT_high']
        low_price = platinum_price_filtered.at[date, 'PLT_low']
        chart_data.append([timestamp, open_price, high_price, low_price, ajclose])

    return {
        'predicted_price': predicted_prices.tolist(),
        'predicted_date_range': predicted_date_range.tolist(),
        'combined_ajclose': combined_ajclose.tolist(),
        'chart_data': chart_data
    }

def get_platinum_price_sample_features(date):
    # Convert the input date to a Timestamp object
    date = pd.Timestamp(date)

    available_dates = X_platinum.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the date
    if date < first_available_date:
        return {'error': 'Date is earlier than the first available date.'}
    elif date > last_available_date:
        return {'error': 'Date is later than the last available date.'}
    
    try:
        # Get the features for the specified date
        features = X_platinum.loc[date].tolist()
        return features
    except KeyError:
        return {'error': 'Data not available for the specified date.'}

def silver_price_prediction_single_day(SF_high,SF_low,SF_open,GOLD_high,GOLD_close,
                                       GOLD_ajclose,GOLD_low,GOLD_open,GDX_high,
                                       GDX_open,GDX_close,GDX_low,GDX_ajclose,
                                       EG_low,EG_open,EG_close,EG_high,
                                       EG_ajclose,PLT_price,PLT_high,PLT_low,
                                       PLT_open,OF_high,OF_price,OF_open,OF_low):
    
    # Create a DataFrame with the input features
    input_data = pd.DataFrame({
        'SF_high': [SF_high],
        'SF_low': [SF_low],
        'SF_open': [SF_open],
        'GOLD_high': [GOLD_high],
        'GOLD_close': [GOLD_close],
        'GOLD_ajclose': [GOLD_ajclose],
        'GOLD_low': [GOLD_low],
        'GOLD_open': [GOLD_open],
        'GDX_high': [GDX_high],
        'GDX_open': [GDX_open],
        'GDX_close': [GDX_close],
        'GDX_low': [GDX_low],
        'GDX_ajclose': [GDX_ajclose],
        'EG_low': [EG_low],
        'EG_open': [EG_open],
        'EG_close': [EG_close],
        'EG_high': [EG_high],
        'EG_ajclose': [EG_ajclose],
        'PLT_price': [PLT_price],
        'PLT_high': [PLT_high],
        'PLT_low': [PLT_low],
        'PLT_open': [PLT_open],
        'OF_high': [OF_high],
        'OF_price': [OF_price],
        'OF_open': [OF_open],
        'OF_low': [OF_low],
    })

    # Scale the input data
    input_data_scaled = scaler.transform(input_data)
    input_data_scaled = pd.DataFrame(input_data_scaled, columns=input_data.columns)

    # Make predictions using the linear regression model
    predicted_price = lr_silver_model.predict(input_data_scaled)

    return predicted_price[0]  # Return the predicted gold price for the single day

def silver_price_prediction_date_range(startDate, endDate):
    # Convert the input endDate to a Timestamp object
    startDate = pd.Timestamp(startDate)
    endDate = pd.Timestamp(endDate)

    available_dates = X_silver_test_scaled.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the dates
    if (startDate >= first_available_date or startDate > endDate):
        return {'error': 'startDate is same or later than the first available prediction date.'}
    if endDate < first_available_date:
        return {'error': 'endDate is earlier than the first available date.'}
    elif endDate > last_available_date:
        return {'error': 'endDate is later than the last available date.'}

    # limit the predicted date range
    predicted_date_range = available_dates[available_dates <= endDate]
    
    # Only the date range before and including the end date
    X_silver_test_scaled_filtered = X_silver_test_scaled[X_silver_test_scaled.index <= endDate]
    
    # Make predictions using the linear regression model for the filtered date range
    predicted_prices = lr_silver_model.predict(X_silver_test_scaled_filtered)
    
    # Create a Series for predicted prices with the filtered date range
    predicted_ajclose = pd.Series(predicted_prices, index=predicted_date_range)
    
    # Concatenate the 'SF_price' values
    offset_day = predicted_date_range[0] - pd.DateOffset(days=1)
    silver_ajclose_before_prediction = silver_price['SF_price'][startDate:offset_day]
    combined_ajclose = pd.concat([silver_ajclose_before_prediction, predicted_ajclose])
    
    silver_price_filtered = silver_price.loc[silver_price.index <= available_dates.max()]
    silver_price_filtered = silver_price_filtered.loc[silver_price_filtered.index >= startDate]
    
    # Create the chart_data list by iterating over the data
    chart_date_range = silver_price.index[(silver_price.index >= startDate) & (silver_price.index <= endDate)]

    chart_data = []
    for date, ajclose in zip(chart_date_range, combined_ajclose):
        timestamp = int(date.timestamp()) * 1000  # Convert to milliseconds
        open_price = silver_price_filtered.at[date, 'SF_open']
        high_price = silver_price_filtered.at[date, 'SF_high']
        low_price = silver_price_filtered.at[date, 'SF_low']
        chart_data.append([timestamp, open_price, high_price, low_price, ajclose])

    return {
        'predicted_price': predicted_prices.tolist(),
        'predicted_date_range': predicted_date_range.tolist(),
        'combined_ajclose': combined_ajclose.tolist(),
        'chart_data': chart_data
    }

def get_silver_price_sample_features(date):
    # Convert the input date to a Timestamp object
    date = pd.Timestamp(date)

    available_dates = X_silver.index
    
    # Find the first date in the available dates
    first_available_date = available_dates.min()
    # Find the last date in the available dates
    last_available_date = available_dates.max()

    # Validate the date
    if date < first_available_date:
        return {'error': 'Date is earlier than the first available date.'}
    elif date > last_available_date:
        return {'error': 'Date is later than the last available date.'}
    
    try:
        # Get the features for the specified date
        features = X_silver.loc[date].tolist()
        return features
    except KeyError:
        return {'error': 'Data not available for the specified date.'}

# Flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/get-available-dates', methods=['POST'])
@cross_origin()
def get_available_dates():
    return jsonify(get_available_date())

@app.route('/single-day/gold', methods=['POST'])
@cross_origin()
def predict_single_day_gold():
    data = request.get_json()
    try:
        GOLD_high = data['GOLD_high']
        GOLD_low = data['GOLD_low']
        GOLD_open = data['GOLD_open']
        GDX_low = data['GDX_low']
        GDX_close = data['GDX_close']
        GDX_high = data['GDX_high']
        GDX_ajclose = data['GDX_ajclose']
        GDX_open = data['GDX_open']
        SF_low = data['SF_low']
        SF_price = data['SF_price']
        SF_open = data['SF_open']
        SF_high = data['SF_high']
        EG_low = data['EG_low']
        EG_open = data['EG_open']
        EG_close = data['EG_close']
        EG_high = data['EG_high']
        EG_ajclose = data['EG_ajclose']
        PLT_price = data['PLT_price']
        PLT_high = data['PLT_high']
        PLT_low = data['PLT_low']
        PLT_open = data['PLT_open']
        OF_high = data['OF_high']
        OF_price = data['OF_price']
        OF_open = data['OF_open']
        OF_low = data['OF_low']
        SF_volume = data['SF_volume']
        
        predicted_price = gold_price_prediction_single_day(GOLD_high, GOLD_low, GOLD_open, GDX_low,
                                     GDX_close, GDX_high, GDX_ajclose, GDX_open,
                                     SF_low, SF_price, SF_open, SF_high, EG_low,
                                     EG_open, EG_close, EG_high, EG_ajclose,
                                     PLT_price, PLT_high, PLT_low, PLT_open,
                                     OF_high, OF_price, OF_open, OF_low, SF_volume)
        return jsonify({'predicted_price': predicted_price})
    except Exception as e:
        return jsonify({'error': str(e)})
 
@app.route('/single-day/gold-sample-features', methods=['POST'])
@cross_origin()
def get_sample_features():
    data = request.get_json()
    try:
        date = data['date']  # Assuming 'date' is a key in your JSON data
        
        # Get gold sample features for the specified date
        sample_features = get_gold_price_sample_features(date)
        
        return jsonify({'sample_features': sample_features})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/trading-chart-gold', methods=['POST'])
@cross_origin()
def predict_date_range():
    data = request.get_json()
    try:
        start_date = data['start_date']
        end_date = data['end_date']
        predictions = gold_price_prediction_date_range(start_date, end_date)
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)})

print('App Ready')
print('---------------------')
if __name__ == '__main__':
    app.run()