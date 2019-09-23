#################################################
# Dependencies
#################################################
import os

import pandas as pd
import numpy as np

from flask import Flask, render_template, jsonify, request # Lori/Sergio: not sure if we need jsonify.
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
    con = sqlite3.connect("./Resources/gdp_olympic.sqlite")
    cursor = con.cursor()
    cursor.execute("SELECT year FROM winter")
    print(cursor.fetchall())

    return render_template("index.html")

# Route to get data for choropleth map
@app.route("/gdp_medals")
def gdp_medals():
    return render_template("index.html") ## Sergio/Lori: Will need to update this, it's just a placeholder action

# Route to get data for line graph 
@app.route("/line_graph")
def line_graph():
    # Setup connection to sqlite database
    conn = sqlite3.connect("./Resources/gdp_olympic.sqlite")

    # Join two main tables
    query = '''
        SELECT wdi.year, wdi.country_name, wdi.country_code, winter.medal, wdi.pop_total
        FROM winter INNER JOIN wdi 
        ON winter.country_code = wdi.country_code
        WHERE winter.year = wdi.year
    '''
    
    # Place output in a dataframe
    df = pd.read_sql_query(query, conn)

    # ---------------------------------
    # Calculate x-values
    years = df.year.unique().tolist()

    # ---------------------------------
    # Calculate y-values: population percentages

    # Create list where each element corresponds to the total population of countries 
    # who medaled in that year's winter olympics, starting from 1960 up until 2014
    pop_totals = [np.sum(df[df.year == year].pop_total.unique()) for year in years]

    # Add empty column to dataframe to fill with population percentages
    df['pop_percentage'] = ''

    # Populate this column
    for i in range(len(df)):
        year = df.iloc[i, 0]
        index = years.index(year)
        df.iloc[i, 5] = np.round(100 * df.iloc[i, 4] / pop_totals[index], 2)

    # Group df by year and country and reset index
    pop_final = pd.DataFrame(df.groupby(['year', 'country_code']).max()['pop_percentage']).reset_index()

    # ---------------------------------
    # Calculate y-values: medal percentages

    # Build a dataframe which counts number of medals by year and country and reset index in the process
    medals_final = pd.DataFrame(df.groupby(['year', 'country_code']).count()['medal']).reset_index()

    # Add empty column 
    medals_final['medal_percentage'] = ''

    # Create series indexed by year with values the total number of medals given out that winter games
    medal_series = df.groupby('year').count()['medal'] 

    # Populate empty column
    for i in range(len(medals_final)):
        year = medals_final.iloc[i, 0]
        medals_final.iloc[i, 3] = np.round(100 * medals_final.iloc[i, 2] / medal_series[year], 2)

    # ---------------------------------
    # Define data dict to jsonify

    data = {
        "years": years,
        "population_percentages": pop_final, # Currently feeding in a dataframe into a dict, check if this is OK
        "medal_percentages": medals_final
    }

    return jsonify(data)

#################################################
# End Flask
#################################################
if __name__ == "__main__":
    app.run(debug=False)