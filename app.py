# Import dependencies
from flask import Flask, render_template, jsonify # Lori/Sergio: not sure if we need jsonify.

# Create an instance of Flask
app = Flask(__name__)

# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")

# End the Flack doc with standard ending
if __name__ == "__main__":
    app.run()