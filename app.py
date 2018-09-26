import numpy as np

import sqlalchemy
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import render_template
from flask import Flask, jsonify
import pymysql
import tax_calculation
#################################################
# Database Setup
#################################################

mysql_link="mysql://zjgcainiao:pythonrocks@boringtaxstory.cz3mz9lucrsr.us-west-2.rds.amazonaws.com:3292/TaxRate"
engine = create_engine(mysql_link)

# reflect an existing database into a new model
# Base=declarative_base()
Base = automap_base()

class household_income_by_state_us (Base):
    __tablename__ = 'household_income_by_state_us',
    State = Column(String(255), primary_key=True)
    Median_Income_2017=Column(Integer)
# reflect the tables
Base.prepare(engine, reflect=True)


# Save reference to the table
Household_Income = Base.classes.household_income_by_state_us

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__, static_folder='./static', static_url_path='')


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    # return (
    #     f"Available Routes:<br/>"
    #     f"/api/v1.0/names<br/>"
    #     f"/api/v1.0/passengers"
    # )
    return render_template('index.html')

@app.route("/states")
def names():
    """Return a list of all passenger names"""
    # Query all passengers
    results = session.query(Household_Income.State).all()

    # Convert list of tuples into normal list
    all_names = list(np.ravel(results))

    return jsonify(all_names)
    
@app.route("/tax_data/<income_input>")
def tax_data_calculation(income_input):
    result=calc_fed_tax(income_input,2017,'Single')
    return jsonify(result)

@app.route("/households")
def passengers():
    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(Household_Income).all()
    # console.log(results)
    # Create a dictionary from the row data and append to a list of all_passengers
    all_households = []
    for household in results:
        households_dict = {}
        households_dict["state"] = household.State
        households_dict["median_income_2017"] = str(household.Median_Income_2017)
        # households_dict["year"] = '2017'
        all_households.append(households_dict)

    return jsonify(all_households)


if __name__ == '__main__':
    app.run(debug=True,)
