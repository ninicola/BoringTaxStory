import pandas as pd
import numpy as np

tax_df=pd.read_csv("https://s3-us-west-2.amazonaws.com/usmapgeojson/FederalTaxBrackets.csv").set_index('Order')

def calc_fed_tax(filing_status):
    #tax_df=pd.read_csv("https://s3-us-west-2.amazonaws.com/usmapgeojson/FederalTaxBrackets.csv").set_index('Order')
<<<<<<< HEAD
    filtered_tax_df = tax_df[(tax_df['Filing Status'] == filing_status)
=======
    filtered_tax_df=tax_df[(tax_df['Filing Status']==filing_status)& \
                       (tax_df['Tax Year']==year) ] \
>>>>>>> a67d0fcb6762087303ba000c3a9a8e83e2839689
                .sort_values(by='Tax Bracket',ascending=True)
    # index_max=filtered_tax_df.index.max()
    # fed_tax_accum_dollar=0
    # for index, row in filtered_tax_df.iterrows():
    #     if (income>=row['Tax Bracket']) & (index+1<index_max) \
    #                                 & (income<=filtered_tax_df.loc[index+1]['Tax Bracket']):
    #         fed_tax_accum_dollar=row['Accumulated_Tax'] \
    #                             +(income-row['Tax Bracket'])*row['Tax Rate']
    #         break
    #     else:
    #         continue
    # fed_tax_accum_rate=fed_tax_accum_dollar/income
    # return (fed_tax_accum_dollar,fed_tax_accum_rate)
    print('We got into calc_fed_tax! filing_status is : ', filing_status)
    return filing_status
