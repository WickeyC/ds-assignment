from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression

gold_price_path = '../../processed_price_gold.csv'
platinum_price_path = '../../processed_price_platinum.csv'
silver_price_path = '../../processed_price_silver.csv'

gold_price = pd.read_csv(gold_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)
platinum_price = pd.read_csv(platinum_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)
silver_price = pd.read_csv(silver_price_path,index_col='Date',parse_dates=True,infer_datetime_format=True)

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


def gold_price_prediction_date_range(endDate):
    # Limit input end date to the range of y_high_corr_train's first day and maximum of '2018-12-31'
    min_date = y_high_corr_train.index.min()
    max_date = pd.to_datetime('2018-12-31')
    endDate = min(max_date, max(endDate, min_date))

    # Modify X_high_corr_test_scaled dataframe to include only the date range before and including the end date
    X_high_corr_test_scaled_filtered = X_high_corr_test_scaled[X_high_corr_test_scaled.index <= endDate]

    # Make predictions using the linear regression model
    predicted_prices = lr_gold_model.predict(X_high_corr_test_scaled_filtered)

    # Combine necessary data for return
    # 1. Extract 'GOLD_open', 'GOLD_high', 'GOLD_low', 'GOLD_volume' for the full date range from gold_price
    gold_price_data = gold_price[['GOLD_open', 'GOLD_high', 'GOLD_low', 'GOLD_volume']]

    # 2. Include both the start date and end date of the predicted data for coloring purposes
    predicted_date_range = pd.date_range(start='2011-12-15', end=endDate, freq='D')

    # 3. Include 'GOLD_ajclose' of the predicted date range from the predicted values
    predicted_ajclose = pd.Series(predicted_prices, index=predicted_date_range)

    # 4. Before the predicted date range, take 'GOLD_ajclose' from gold_price
    gold_ajclose_before_prediction = gold_price['GOLD_ajclose'][:predicted_date_range[0]]

    # Concatenate the 'GOLD_ajclose' values
    combined_ajclose = pd.concat([gold_ajclose_before_prediction, predicted_ajclose])

    return {
        'predicted_price': predicted_prices.tolist(),
        'gold_price_data': gold_price_data.to_dict(orient='index'),
        'predicted_date_range': predicted_date_range.tolist(),
        'combined_ajclose': combined_ajclose.tolist()
    }


# Flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/content-based', methods=['POST'])
@cross_origin()
def contentBased():
    content = request.get_json()
    product_title = content['title']
    if product_title not in all_titles:
        
        return jsonify(
            success = False,
            message = "Product not found"
        )
    else:
        result_final = ensemble_recommendations(product_title)
        return result_final.to_json(orient='records')
    
@app.route('/titles', methods=['GET'])
@cross_origin()
def getTitle():
    return jsonify(
        data = all_titles
    )

if __name__ == '__main__':
    app.run()