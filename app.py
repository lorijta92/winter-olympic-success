#################################################
# Dependencies
#################################################
import os

import pandas as pd
import numpy

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

    # ---------------------------------
    # X-AXIS VALUES
    # ---------------------------------

    # Run query to get x-axis values
    winter_years_query = "SELECT DISTINCT year FROM winter"
    cursor.execute(winter_years_query)
    winter_years = cursor.fetchall()

    # Reformat list of winter_years so elements are years instead of tuples
    winter_years = [year[0] for year in winter_years]

    # Print the winter years
    print(winter_years)

    # ---------------------------------
    # Y-AXIS VALUES
    # ---------------------------------

    # Run query and build dataframe for analysis to help us calculate
    # y-axis values for both population percentage and medal count percentage.
    main_query = ''' 
        SELECT wdi.year, wdi.country_name, winter.medal, wdi.pop_total
        FROM winter INNER JOIN wdi 
        ON winter.year = wdi.year 
    '''
    df = pd.read_sql_query(main_query, conn)

    # ---------------------------------
    # Calculate population percentages

    # Build a series with population totals per winter olympic year
    pop_totals = df.groupby('year').sum()['pop_total']

    # 





    # ---------------------------------
    # Calculate medal count percentages


    return render_template("index.html")

#################################################
# End Flask
#################################################
if __name__ == "__main__":
    app.run(debug=False)