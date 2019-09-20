#################################################
# Dependencies and Setup
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

<<<<<<< HEAD
=======
import sqlite3

>>>>>>> a49893596b52ba3805e9248eec8fa60757f14b65
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
<<<<<<< HEAD
Winter = Base.classes.winter_clean
Summer = Base.classes.summer_clean
Athlete = Base.classes.athlete_clean
Regions = Base.classes.regions
Country = Base.classes.country
Soccer = Base.classes.soccer
=======
# Winter = Base.classes.winter_clean
# Summer = Base.classes.summer
# Athlete = Base.classes.athlete
# Regions = Base.classes.regions
# Country = Base.classes.country
# Soccer = Base.classes.soccer
>>>>>>> a49893596b52ba3805e9248eec8fa60757f14b65

#################################################
# Route Setup
#################################################

# Route to render index.html template
@app.route("/")
def home():

<<<<<<< HEAD
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Winter)
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(df)
=======
    con = sqlite3.connect("./Resources/gdp_olympic.sqlite")
    cursor = con.cursor()
    cursor.execute("SELECT year FROM winter_clean")
    print(cursor.fetchall())
    
>>>>>>> a49893596b52ba3805e9248eec8fa60757f14b65
    return render_template("index.html")

# End the Flack doc with standard ending
if __name__ == "__main__":
    app.run(debug=False)