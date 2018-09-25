import pandas as pd
import numpy as np

tax_df=pd.read_csv("https://s3-us-west-2.amazonaws.com/usmapgeojson/FederalTaxBrackets.csv").set_index('Order')

def calc_fed_tax(income,year,filing_status):
    filtered_tax_df=tax_df[(tax_df['Filing Status']=='Single')& \
                       (tax_df['Tax Year']==2018) ] \
                .sort_values(by='Tax Bracket',ascending=True)
    index_max=filtered_tax_df.index.max()
    fed_tax_accum_dollar=0
    for index, row in filtered_tax_df.iterrows():
        if (income>=row['Tax Bracket']) & (index+1<index_max) \
                                    & (income<=filtered_tax_df.loc[index+1]['Tax Bracket']):
            fed_tax_accum_dollar=row['Accumulated_Tax'] \
                                +(income-row['Tax Bracket'])*row['Tax Rate']
            break
        else:
            continue
    fed_tax_accum_rate=fed_tax_accum_dollar/income
    return (fed_tax_accum_dollar,fed_tax_accum_rate)