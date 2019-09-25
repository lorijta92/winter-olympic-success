#################################################
# Dependencies
#################################################
import os
import csv

import pandas as pd
import numpy as np

from flask import Flask, render_template, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

import sqlite3

# Create an instance of Flask
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# Configure our Flask instance to sqllite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Resources/gdp_olympic.sqlite'

# Create database object using SQLAlchemy
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Winter = Base.classes.winter
# Summer = Base.classes.summer
# Athlete = Base.classes.athlete
# Regions = Base.classes.regions
# WDI = Base.classes.wdi
# Soccer = Base.classes.soccer

#################################################
# Route Setup
#################################################

# Route to render index.html template
@app.route("/")
def home():
    # conn = sqlite3.connect("./Resources/gdp_olympic.sqlite")
    # cursor = conn.cursor()
    # cursor.execute("SELECT year FROM winter")
    # print(cursor.fetchall())

    return render_template("index.html")



# # Route to get data for choropleth map
# @app.route("/gdp_medals")
# def gdp_medals():
    
#     # Connect to sqlite database
#     conn = sqlite3.connect("./Resources/gdp_olympic.sqlite")

#     # Selected needed values from summer table and add column
#     summer_df = pd.read_sql('SELECT year, country_code, medal FROM summer', conn)
#     summer_df['game'] = 'summer'

#     # Selected needed values from winter table and add column
#     winter_df = pd.read_sql('SELECT year, country_code, medal FROM winter', conn)
#     winter_df['game'] = 'winter'

#     # Combine summer and winter tables as 'games'
#     games = pd.concat([summer_df, winter_df], sort=False)

#     # Selected needed values from wdi table
#     wdi_df = pd.read_sql('SELECT country_name, country_code, year, gdp_per_cap FROM wdi', conn)

#     # Merge with 'games' with 'wdi_df'
#     df = pd.merge(games, wdi_df, left_on=['country_code', 'year'], right_on=['country_code', 'year'])

#     # Extract count of medals per country per year
#     df2 = df.groupby(['year', 'country_name', 'game', 'medal']).count() # Group data and count medals by type
#     df2 = df2.reset_index()
#     df2 = df2.iloc[:, 0:5] # Selected needed columns and drop excess
#     df2 = df2.rename(columns={'country_code':'medal_count'})

#     # Pivot data frame so that each medal type is a column
#     medals_df = pd.pivot_table(df2, values='medal_count', index=['year', 'country_name', 'game'], columns='medal', fill_value=0)
#     medals_df = medals_df.reset_index()
    
#     # Extract each country's gdp per year
#     df3 = df.groupby(['year', 'country_code']).max()
#     df3 = df3.reset_index()
#     df3 = df3.drop(columns=['medal','game'])

#     # Combine all information: gdp and medal count
#     final_df = pd.merge(medals_df, df3, left_on=['country_name', 'year'], right_on=['country_name', 'year'])

#     # Reorder columns
#     final_df = final_df[['year','country_name','gdp_per_cap','game', 'Gold', 'Silver', 'Bronze']]

#     # Rename columns
#     final_df = final_df.rename(columns={'country_name':'country',
#                             'gdp_per_cap':'gdp',
#                             'Gold':'gold',
#                             'Silver':'silver',
#                             'Bronze':'bronze'
#                             })
    
#     # Save data to dictionary
#     gdp_medals = final_df.to_dict(orient='records')

#     return jsonify(gdp_medals)


# Route to get data for line graph 
@app.route("/line_graph")
def line_graph():
    
    # Load in data frame
    df = pd.read_csv('./Resources/line_graph.csv', dtype=str)

    # Create dictionary with key == country_code and values == dictionaries of pop_percentage and medal_percentage
    data = {}

    for i in range(len(df)):
        # Define row variable to describe the row we are on in current iteration
        row = df.iloc[i, :]
        
        # Define an empty list variable so we can append such an empty list when adding a new country
        empty_list = []
        
        # Conditional to check if country_code not already in the dictionary (add it if it's not)
        if row.country_code not in data.keys():
            data.update({
                row.country_code: empty_list
            })
            
        # Get the list corresponding to the current row's country code
        country_list = data.get(row.country_code)
        
        # Create a new element of that list which is a dictionary. JSON does not recognize
        # numpy data types, so casting as python ints and floats using the item() method.
        country_list.append({
            'year': int(row.year),
            'pop_percentage': float(row.pop_percentage),
            'medal_percentage': float(row.medal_percentage)
        })

    return jsonify(data)

#################################################
# End Flask
#################################################
if __name__ == "__main__":
    app.run(debug=False)