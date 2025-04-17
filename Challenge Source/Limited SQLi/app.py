from string import ascii_letters
import os
from flask import Flask, request, render_template
import sqlite3
import secrets
from itertools import cycle

def xor(bytes1, bytes2):
    return bytes([a ^ b for a, b in zip(bytes1, cycle(bytes2))])

FLAG = b"KAINOS{REDACTED}"
DATABASE = "users.db"

app = Flask(__name__)

cert_path = os.getenv("SSL_CERT_PATH")
key_path = os.getenv("SSL_KEY_PATH")

table_to_num_queries = {}


def setup_table(table_name):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(f'''
        CREATE TABLE {table_name} (
            item TEXT NOT NULL,
            value TEXT NOT NULL
        )
    ''')
    flag_key = secrets.token_bytes(16)
    cursor.execute(f'''
        INSERT INTO {table_name} (item, value) VALUES
        ('example', 'I hope you''re enjoying the CTF :)'),
        ('flag_key', ?)
    ''', ("Key: " + flag_key.hex(),))
    conn.commit()
    conn.close()
    flag_encrypted = xor(FLAG, flag_key)
    print(f"Table {table_name} created with key: {flag_key.hex()}")
    table_to_num_queries[table_name] = 0
    return flag_encrypted.hex()


def delete_table(table_name):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(f"DROP TABLE {table_name}")
    conn.commit()
    conn.close()
    del table_to_num_queries[table_name]


@app.route("/", methods=["GET"])
def login():
    return render_template("index.html")


@app.route("/create", methods=["POST"])
def create():
    table_name = request.form["table_name"]
    if any(c not in ascii_letters for c in table_name) or len(table_name) > 10:
        return render_template("index.html", create_error="Invalid table name.")

    if table_name in table_to_num_queries:
        return render_template("index.html", create_error="Table already exists.")

    try:
        flag_encrypted = setup_table(table_name)
        return render_template("index.html", flag_encrypted=flag_encrypted)
    except:
        return render_template("index.html", create_error="Error creating table.")


def is_sqli(item):
    item = item.lower()
    if "-" in item:  # No comments!
        return True
    if "union" in item:  # No UNION injection!
        return True
    return False


@app.route("/query")
def query():
    table_name = request.args.get("table_name")
    item = request.args.get("item")
    if any(c not in ascii_letters for c in table_name) or len(table_name) > 10:
        return render_template("index.html", query_error="Invalid table name.")
    if table_name not in table_to_num_queries:
        return render_template("index.html", query_error="Table does not exist.")
    if "flag_key" in item.lower().strip():
        return render_template("index.html", query_error="No!")
    if is_sqli(item):
        return render_template("index.html", query_error="SQL Injection detected.")

    table_to_num_queries[table_name] += 1
    if table_to_num_queries[table_name] > 160:  # Magic number pulled from thin air
        try:
            delete_table(table_name)
        except:
            return render_template("index.html", query_error="Error deleting table.")
        return render_template("index.html", query_error="Too many queries, goodbye table!")

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute(f"SELECT value FROM {table_name} WHERE item = '{item}'")
        value = cursor.fetchone()
        conn.close()
    except Exception as e:
        return render_template("index.html", query_error="Error: " + str(e))

    if value is None:
        return render_template("index.html", query_error="Item not found.")
    value = value[0]
    if "key" in value.lower():
        return render_template("index.html", query_error="No!")
    return render_template("index.html", query_result=value)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, ssl_context=(cert_path, key_path))
