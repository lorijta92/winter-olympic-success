#################################################
# Dependencies and Setup
#################################################

from flask import Flask, render_template, jsonify, request # Lori/Sergio: not sure if we need jsonify.
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


# Create an instance of Flask
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# Configure our Flask instance to sqllite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/bellybutton.sqlite'

# Create database object using SQLAlchemy
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Winter = Base.classes.winter
Summer = Base.classes.summer
Athlete = Base.classes.athlete
Regions = Base.classes.regions
Country = Base.classes.country
Soccer = Base.classes.soccer

#################################################
# Route Setup
#################################################

# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")

# End the Flack doc with standard ending
if __name__ == "__main__":
    app.run()