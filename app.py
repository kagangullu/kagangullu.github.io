from flask import Flask, render_template
import csv

app = Flask(__name__)

@app.route('/')
def index():
    users = []
    with open('data.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file, delimiter=';')
        for row in csv_reader:
            users.append({
                'Full_name': row['full_name'],
                'Username': row['username'],
                'Is_verified': row['is_verified'],
            })

    return render_template('index.html', users=users)

if __name__ == '__main__':
    app.run(debug=True)