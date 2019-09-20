# Import dependencies
from flask import Flask, render_template, jsonify, request # Lori/Sergio: not sure if we need jsonify.
from flask_sqlalchemy import SQLAlchemy

# Create an instance of Flask
app = Flask(__name__)

# Configure our Flask instance to postgresql database (note that the server is not the default 5432. It is 5433.)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/gdpolympics'

# Create database object using SQLAlchemy
db = SQLAlchemy(app)

# ----------------------------------------------------------------------
# Create our db model






# ----------------------------------------------------------------------


# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")

# End the Flack doc with standard ending
if __name__ == "__main__":
    app.run()