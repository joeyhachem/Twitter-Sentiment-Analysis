import requests

import helpers


def twitter_auth_and_connect(bearer_token: str, url: str):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    response = requests.request("GET", url, headers=headers)
    return response.json()


def get_user_details(bearer_token: str, handle=""):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}

    url = helpers.create_url_fetch_details_about_user(handle)

    response = requests.request("GET", url, headers=headers)
    return response.json()


# Need to paginate through the list of results coming from twitter api.
# More info on pagination found on twitter website: https://developer.twitter.com/en/docs/twitter-api/pagination
def fetch_all_tweets(bearer_token: str, handle) -> list:
    tweets = []
    user_details = get_user_details(bearer_token, handle)
    user_id = user_details["data"]["id"]

    url = helpers.create_url_fetch_all_tweets(user_id)
    resp = twitter_auth_and_connect(bearer_token, url)

    while resp:
        # Once a response is returned without a next_token value, it can be assumed that all results
        # have been paged through.
        if not resp.get("meta").get("next_token"):
            break
        tweets.extend(resp["data"])

        url = helpers.create_url_fetch_all_tweets(user_id, resp["meta"]["next_token"])

        resp = twitter_auth_and_connect(bearer_token, url)

    if resp.get("data"):
        tweets.extend(resp.get("data"))
    return tweets


# The document size must be under 5,120 characters per document.
# You can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request.
# Obtain languages or sentiment scores using azure's Cognitive Services
def call_azure(shaped_data, url, subscription_key):
    headers = helpers.build_azure_header(subscription_key)

    response = requests.post(url, headers=headers, json=shaped_data)
    return response.json()
