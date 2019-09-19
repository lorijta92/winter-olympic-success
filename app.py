# Import dependencies
from flask import Flask, render_template, jsonify, request # Lori/Sergio: not sure if we need jsonify.
from flask_sqlalchemy import SQLAlchemy

# Create an instance of Flask
app = Flask(__name__)

# Setup connection to the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/gdpolympics'
db = SQLAlchemy(app)

# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")

# End the Flack doc with standard ending
if __name__ == "__main__":
    app.run()