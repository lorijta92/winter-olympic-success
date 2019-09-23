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
    cursor = conn.cursor()

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
    



    return render_template("index.html")

#################################################
# End Flask
#################################################
if __name__ == "__main__":
    app.run(debug=False)