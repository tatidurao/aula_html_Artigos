from flask import Flask, jsonify, request
import pandas as pd
from demographic_filtering import output
from content_filtering import get_recommendations
from flask import send_from_directory

articles_data = pd.read_csv('articles.csv')
all_articles = articles_data[['url' , 'title' , 'text' , 'lang' , 'total_events', 'contentId']]

app = Flask(__name__)

liked_articles = []
not_liked_articles = []

def assign_val():
    m_data = {
        "url": all_articles.iloc[0,0],
        "title": all_articles.iloc[0,1],
        "text": all_articles.iloc[0,2] or "N/A",
        "lang": all_articles.iloc[0,3],
        "total_events": str(all_articles.iloc[0,4]),
        "contentId" : str(all_articles.iloc[0,5])
    }
    return m_data

@app.route("/get-article")
def get_article():

    article_info = assign_val()
    return jsonify({
        "data": article_info,
        "status": "success"
    })

@app.route("/liked-article")
def liked_article():
    global all_articles
    article_info = assign_val()
    liked_articles.append(article_info)
    all_articles.drop([0], inplace=True)
    all_articles = all_articles.reset_index(drop=True)
    return jsonify({
        "status": "success"
    })

@app.route("/unliked-article")
def unliked_article():
    global all_articles
    article_info = assign_val()
    not_liked_articles.append(article_info)
    all_articles.drop([0], inplace=True)
    all_articles = all_articles.reset_index(drop=True)
    return jsonify({
        "status": "success"
    })

@app.route("/popular-articles")
def popular_articles():
    article_info = []
    for index , row in output.iterrows():
        _d = {
            "url": row['url'],
            "title": row['title'],
            "text": row['text'],
            "lang": row['lang'],
            "total_events": row['total_events']
        }
        article_info.append(_d)

    return jsonify({
        "data": article_info,
        "status": "success"
    })

@app.route("/recommended-articles")
def recommend_articles():
    global liked_articles
    #col_names=['url', 'title', 'text', 'lang', 'total_events']
    #all_recommended = pd.DataFrame(columns=col_names)
    recommendations_list = []
    
    for article in liked_articles:
        output = get_recommendations(article["contentId"])
        recommendations_list.append(output)

    if recommendations_list:    
         all_recommended = pd.concat(recommendations_list, ignore_index=True)
    else:
        all_recommended = pd.DataFrame(columns=['url' , 'title' , 'text' , 'lang' , 'total_events', 'contentId'])

    all_recommended.drop_duplicates(subset=["title"],inplace=True)

    recommended_data = []

    for index, row in all_recommended.iterrows():
        _d = {
            "url": row['url'],
            "title": row['title'],
            "text": row['text'],
            "lang": row['lang'],
            "total_events": row['total_events']
        }
        recommended_data.append(_d)

    return jsonify({
        "data":recommended_data,
        "status": "success"
    })
    
@app.route("/recommended-by-lang")
def recommend_by_lang():
    lang = request.args.get("lang", "en")
    filtered = all_articles[all_articles["lang"] == lang].head(10)

    data = filtered.to_dict(orient="records")
    return jsonify({
        "data": data,
        "status": "success"
    })

@app.route("/history")
def history():
    return jsonify({
        "liked": liked_articles,
        "unliked": not_liked_articles,
        "status": "success"
    })
    


@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/popular')
def serve_popular():
    return send_from_directory('static', 'popular.html')

@app.route('/recomendado')
def serve_recomendado():
    return send_from_directory('static', 'recomendado.html')


if __name__ == "__main__":
  app.run()