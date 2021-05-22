import yaml
import json
import ast
import pandas


def create_url_fetch_recent_tweets(handle: str):
    max_results = 100
    mrf = "max_results={}".format(max_results)
    q = "query=from:{}".format(handle)
    url = "https://api.twitter.com/2/tweets/search/recent?{}&{}".format(
        mrf, q
    )
    return url


def create_url_fetch_all_tweets(user_id: str, paginate_token=""):
    max_results = 100

    if paginate_token:
        url = "https://api.twitter.com/2/users/{}/tweets?max_results={}&pagination_token={}".format(
            user_id, max_results, paginate_token
        )
    else:
        url = "https://api.twitter.com/2/users/{}/tweets?max_results={}".format(
            user_id, max_results
        )
    return url


def create_url_fetch_details_about_user(handle: str):
    url = "https://api.twitter.com/2/users/by/username/{}".format(
        handle
    )

    return url


# Format the data to match the format mentioned in:
# https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/quickstarts/client-libraries-rest-api
def shape_data_for_azure(list_of_tweets: list):
    doc_start = '"documents": {}'.format(list_of_tweets)
    str_json = "{" + doc_start + "}"
    dump_doc = json.dumps(str_json)
    doc = json.loads(dump_doc)
    return ast.literal_eval(doc)


def connect_to_azure(data):
    azure_url = "https://cirtik-assignment.cognitiveservices.azure.com/"
    language_api_url = "{}text/analytics/v2.1/languages".format(azure_url)
    sentiment_url = "{}text/analytics/v2.1/sentiment".format(azure_url)
    subscription_key = data["azure"]["subscription_key"]
    return language_api_url, sentiment_url, subscription_key


def build_azure_header(security_key: str):
    header = {
        "Ocp-Apim-Subscription-Key": security_key,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    return header


def combine_lang_data(shaped_data, list_with_languages):
    if list_with_languages.get("documents") is None:
        return list_with_languages.get("error")
    langs = pandas.DataFrame(list_with_languages["documents"])
    lang_iso = [x.get("iso6391Name")
                for d in langs.detectedLanguages if d for x in d]
    data_only = shaped_data["documents"]
    tweet_data = pandas.DataFrame(data_only)
    tweet_data.insert(2, "language", lang_iso, True)
    json_lines = tweet_data.to_json(orient="records")
    return json_lines


def add_document_format(json_lines):
    docu_format = '"' + "documents" + '"'
    json_docu_format = "{}:{}".format(docu_format, json_lines)
    docu_align = "{" + json_docu_format + "}"
    jd_align = json.dumps(docu_align)
    jl_align = json.loads(jd_align)
    return ast.literal_eval(jl_align)


def calculate_average_sentiment_score(list_of_tweets_with_scores: list):
    total = 0
    positive, neutral, negative = 0, 0, 0

    if list_of_tweets_with_scores.get("documents") is None:
        return list_of_tweets_with_scores.get("error"), {}

    for item in list_of_tweets_with_scores["documents"]:
        score = item["score"]

        total += score

        if score >= 0.75:
            positive += 1
        elif 0.75 > score >= 0.45:
            neutral += 1
        else:
            negative += 1

    stats = {"positive": positive, "neutral": neutral, "negative": negative}

    return total / len(list_of_tweets_with_scores["documents"]), stats


def build_tweets_string(list_of_tweets: list):
    merged_string = ""
    for item in list_of_tweets:
        merged_string += " " + item["text"].lower()

    return merged_string


def process_yaml():
    with open("config.yaml") as file:
        return yaml.safe_load(file)


def create_bearer_token(data):
    return data["search_tweets_api"]["bearer_token"]
