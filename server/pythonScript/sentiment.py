from pymongo import MongoClient
from langdetect import detect
from transformers import CamembertTokenizer, CamembertForSequenceClassification, BertTokenizer, BertForSequenceClassification
import torch

# MongoDB connection string
mongo_url = "mongodb+srv://root:root@cluster0.0uuyrdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Load CamemBERT model and tokenizer for French
tokenizer_fr = CamembertTokenizer.from_pretrained("camembert-base")
model_fr = CamembertForSequenceClassification.from_pretrained("camembert-base")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_fr.to(device)

# Load DziriBERT model and tokenizer for Arabic
# Assuming DziriBERT is already installed and available
from transformers import BertTokenizer, BertForSequenceClassification

tokenizer_ar = BertTokenizer.from_pretrained("alger-ia/dziribert")
model_ar = BertForSequenceClassification.from_pretrained("alger-ia/dziribert")
model_ar.to(device)

# Load BERT model and tokenizer for English
tokenizer_en = BertTokenizer.from_pretrained("bert-base-uncased")
model_en = BertForSequenceClassification.from_pretrained("bert-base-uncased")
model_en.to(device)

# Function to classify sentiment using CamemBERT for French
def classify_sentiment_fr(text):
    inputs = tokenizer_fr(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    inputs.to(device)
    outputs = model_fr(**inputs)
    logits = outputs.logits
    sentiment_label = torch.argmax(logits, dim=1).item()
    if sentiment_label == 1:
        sentiment = "positive"
    elif sentiment_label == 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return sentiment

# Function to classify sentiment using DziriBERT for Arabic
def classify_sentiment_ar(text):
    inputs = tokenizer_ar(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    inputs.to(device)
    outputs = model_ar(**inputs)
    logits = outputs.logits
    sentiment_label = torch.argmax(logits, dim=1).item()
    if sentiment_label == 1:
        sentiment = "positive"
    elif sentiment_label == 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return sentiment

# Function to classify sentiment using BERT for English
def classify_sentiment_en(text):
    inputs = tokenizer_en(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    inputs.to(device)
    outputs = model_en(**inputs)
    logits = outputs.logits
    sentiment_label = torch.argmax(logits, dim=1).item()
    if sentiment_label == 1:
        sentiment = "positive"
    elif sentiment_label == 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return sentiment

try:
    # Connect to MongoDB
    client = MongoClient(mongo_url)
    print("Connected successfully to MongoDB!\n")

    # Access the database
    db = client["test"]
    print("Accessed database: Cluster0\n")

    # Access the "publications" collection
    publications_collection = db["publications"]
    print("Accessed collection: publications\n")

    # Retrieve all publications from the collection
    all_publications = publications_collection.find()

    # Update comments with language attribute and sentiment analysis
    for publication in all_publications:
        comments = publication.get("comments", [])
        for comment in comments:
            # Detect language of the comment
            language = detect(comment.get("content", ""))
            if language == "fr":
                # Classify sentiment for French comments
                sentiment = classify_sentiment_fr(comment.get("content"))
                print("Comment (French):", comment.get("content"))
                print("Sentiment:", sentiment)
            elif language == "ar":
                # Classify sentiment for Arabic comments
                sentiment = classify_sentiment_ar(comment.get("content"))
                print("Comment (Arabic):", comment.get("content"))
                print("Sentiment:", sentiment)
            elif language == "en":
                # Classify sentiment for English comments
                sentiment = classify_sentiment_en(comment.get("content"))
                print("Comment (English):", comment.get("content"))
                print("Sentiment:", sentiment)
            else:
                # Default to Arabic if language is not detected as English, French, or Arabic
                language = "ar"
                sentiment = classify_sentiment_ar(comment.get("content"))
                print("Comment (Arabic - Default):", comment.get("content"))
                print("Sentiment:", sentiment)
                
            # Update comment in MongoDB with sentiment attribute
            publications_collection.update_one(
                {"_id": publication["_id"], "comments._id": comment["_id"]},
                {"$set": {"comments.$.sentiment": sentiment, "comments.$.language": language}}
            )
            print("Comment sentiment updated successfully!")
except Exception as e:
    print("An error occurred:", e)
