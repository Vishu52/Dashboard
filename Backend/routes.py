from flask import Blueprint, request, jsonify
from .models import mysql

api = Blueprint('api', __name__)

@api.route('/api/data', methods=['POST'])
def create_data():
    data = request.get_json()
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO your_table (
                end_year, intensity, sector, topic, insight,
                url, region, start_year, impact, added,
                published, country, relevance, pestle, source,
                title, likelihood
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                data.get('end_year'), data.get('intensity'), data.get('sector'),
                data.get('topic'), data.get('insight'), data.get('url'),
                data.get('region'), data.get('start_year'), data.get('impact'),
                data.get('added'), data.get('published'), data.get('country'),
                data.get('relevance'), data.get('pestle'), data.get('source'),
                data.get('title'), data.get('likelihood')
            )
        )
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Data created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/api/data', methods=['GET'])
def get_data():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM your_table")
        results = cur.fetchall()
        cur.close()

        data = [{
            'end_year': row[0],
            'intensity': row[1],
            'sector': row[2],
            'topic': row[3],
            'insight': row[4],
            'url': row[5],
            'region': row[6],
            'start_year': row[7],
            'impact': row[8],
            'added': row[9],
            'published': row[10],
            'country': row[11],
            'relevance': row[12],
            'pestle': row[13],
            'source': row[14],
            'title': row[15],
            'likelihood': row[16]
        } for row in results]

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
