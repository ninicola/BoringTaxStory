import os

import numpy as np

import sqlalchemy
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import render_template
from flask import Flask, jsonify
import pymysql
from tax_calculation import calc_fed_tax
# from flask_cache import Cache

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
    Median_Income_2016=Column(Integer)
    Median_Income_2015=Column(Integer)
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
# @cacfhe.cached(timeout=50)
def welcome():
    """List all available api routes."""
    # return (
    #     f"Available Routes:<br/>"
    #     f"/api/v1.0/names<br/>"
    #     f"/api/v1.0/passengers"
    # )
    return render_template('index.html')

@app.route("/states")
def fetch_state_names():
    """Return a list of all passenger names"""
    # Query all passengers
    results = session.query(Household_Income.State).all()

    # Convert list of tuples into normal list
    all_names = list(np.ravel(results))

    return jsonify(all_names)
    
@app.route("/tax_data/<status>")
def tax_data_calculation(status):
    income_input_range=[]
    result_list=[]
    for i in range(10,110):
        income_input=i*1000
        income_input_range.append(i*1000)
        tax_result=calc_fed_tax(status)
        tax_result_json={
            'gross_income':income_input,
            'federal_tax_rate': tax_result[1],
            'federal_tax_dollar':tax_result[0]
        }
        result_list.append(tax_result_json)
    return jsonify(result_list)

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
        households_dict["median_income_2016"] = str(household.Median_Income_2016)
        households_dict["median_income_2015"] = str(household.Median_Income_2015)        
        # households_dict["year"] = '2017'
        all_households.append(households_dict)

    return jsonify(all_households)


if __name__ == '__main__':
    app.run(debug=True,)
