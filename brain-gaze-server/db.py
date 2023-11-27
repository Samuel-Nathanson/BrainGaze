import json
import pandas as pd
import sqlite3

def init_db():
    conn = sqlite3.connect('example.db')
    c = conn.cursor()

    # Create table with an additional 'data_type' column
    c.execute('''CREATE TABLE IF NOT EXISTS session_data
                 (session_id TEXT, data_type TEXT, data TEXT,
                 PRIMARY KEY (session_id, data_type))''')

    conn.commit()
    conn.close()

def save_json_data(session_id, data_type, json_data):
    conn = sqlite3.connect('example.db')
    c = conn.cursor()

    # Insert or replace the data
    c.execute("INSERT OR REPLACE INTO session_data (session_id, data_type, data) VALUES (?, ?, ?)", 
              (session_id, data_type, json.dumps(json_data)))

    conn.commit()
    conn.close()


if __name__ == "__main__":
  # Connect to the SQLite database
  conn = sqlite3.connect('example.db')

  # SQL query to select all data
  query = "SELECT * FROM session_data"

  # Read the SQL query into a DataFrame
  df = pd.read_sql_query(query, conn)

  # Close the connection
  conn.close()

  # Now you can work with the DataFrame `df`
  print(df)  # Display the first few rows of the DataFrame

  df.to_csv("sample_data.csv")