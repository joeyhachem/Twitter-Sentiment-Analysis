import flask
from flask import Flask
import helpers
import service
from wordcloud import WordCloud, STOPWORDS

app = Flask(__name__)
stopwords = set(STOPWORDS)
yaml_data = helpers.process_yaml()
bearer_token = helpers.create_bearer_token(yaml_data)


# Return a list of tweets from the last 7 days.
@app.route('/recent-tweets/<username>', methods=['GET'])
def recent_tweets(username):
    url = helpers.create_url_fetch_recent_tweets(str(username))

    resp = service.twitter_auth_and_connect(bearer_token, url)

    return resp


# Return average sentiment score of the all the tweets of a user, with a maximum of 3200 tweets
# according to the following api doc: https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/introduction
@app.route("/all-tweets/<username>/<height>/<width>", methods=['GET'])
def all_tweets(username, height=400, width=400):
    language_api_url, sentiment_url, subscription_key = helpers.connect_to_azure(yaml_data)

    list_of_tweets = service.fetch_all_tweets(bearer_token, str(username))

    shaped_data = helpers.shape_data_for_azure(list_of_tweets)
    # an entry in list_of_tweets_with_languages will have an id and a language field
    list_of_tweets_with_languages = service.call_azure(shaped_data, language_api_url, subscription_key)

    combined_data = helpers.combine_lang_data(shaped_data, list_of_tweets_with_languages)
    formatted_doc = helpers.add_document_format(combined_data)

    # an entry in list_of_tweets_with_languages will have an id and a score field
    list_of_tweets_with_sentiment_scores = service.call_azure(formatted_doc, sentiment_url,
                                                              subscription_key)

    average_sentiment_score, stats = helpers.calculate_average_sentiment_score(list_of_tweets_with_sentiment_scores)

    string_of_tweets = helpers.build_tweets_string(list_of_tweets)

    wordcloud_svg = {}
    if string_of_tweets:
        wordcloud = WordCloud(width=int(width), height=int(height),
                              background_color='white',
                              stopwords=stopwords,
                              min_font_size=10,
                              max_words=100000).generate(string_of_tweets)
        wordcloud_svg = wordcloud.to_svg(embed_font=True)

        # To create an svg file locally
        # f = open("filename.svg", "w+")
        # f.write(wordcloud_svg)
        # f.close()

    response = flask.jsonify({"average_sentiment_score": average_sentiment_score, "svg": wordcloud_svg, "stats": stats})
    response.headers.add("Access-Control-Allow-Origin", "*")

    # responseJson = json.dumps(response)
    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
