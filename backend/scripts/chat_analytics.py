#!/usr/bin/env python3
import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/acharyapath')
client = MongoClient(MONGODB_URI)
db = client.get_database()

def get_chat_activity(days=30):
    """Get chat activity for the last N days"""
    # Get messages from the last N days
    cutoff_date = datetime.now() - pd.Timedelta(days=days, unit='d')
    
    # Query MongoDB
    messages = list(db.messages.find({
        'createdAt': {'$gte': cutoff_date}
    }))
    
    if not messages:
        return {
            'total_messages': 0,
            'active_users': 0,
            'active_topics': 0,
            'activity_by_day': [],
            'activity_by_topic': []
        }
    
    # Convert to DataFrame
    df = pd.DataFrame(messages)
    
    # Convert ObjectId to string
    df['_id'] = df['_id'].astype(str)
    df['sender'] = df['sender'].astype(str)
    df['topicId'] = df['topicId'].astype(str)
    
    # Get topics
    topics = {t['_id']: t['name'] for t in db.topics.find()}
    
    # Add topic name
    df['topic_name'] = df['topicId'].map(lambda x: topics.get(x, 'Unknown'))
    
    # Group by day
    df['date'] = pd.to_datetime(df['createdAt']).dt.date
    daily_activity = df.groupby('date').size().reset_index(name='count')
    daily_activity['date'] = daily_activity['date'].astype(str)
    
    # Group by topic
    topic_activity = df.groupby('topic_name').size().reset_index(name='count')
    
    return {
        'total_messages': len(df),
        'active_users': df['sender'].nunique(),
        'active_topics': df['topicId'].nunique(),
        'activity_by_day': daily_activity.to_dict('records'),
        'activity_by_topic': topic_activity.to_dict('records')
    }

def get_user_activity(user_id=None, days=30):
    """Get activity for a specific user"""
    # Get messages from the last N days
    cutoff_date = datetime.now() - pd.Timedelta(days=days, unit='d')
    
    # Query MongoDB
    query = {'createdAt': {'$gte': cutoff_date}}
    if user_id:
        query['sender'] = user_id
        
    messages = list(db.messages.find(query))
    
    if not messages:
        return {
            'total_messages': 0,
            'active_topics': 0,
            'activity_by_day': [],
            'activity_by_topic': []
        }
    
    # Convert to DataFrame
    df = pd.DataFrame(messages)
    
    # Convert ObjectId to string
    df['_id'] = df['_id'].astype(str)
    df['sender'] = df['sender'].astype(str)
    df['topicId'] = df['topicId'].astype(str)
    
    # Get topics
    topics = {t['_id']: t['name'] for t in db.topics.find()}
    
    # Add topic name
    df['topic_name'] = df['topicId'].map(lambda x: topics.get(x, 'Unknown'))
    
    # Group by day
    df['date'] = pd.to_datetime(df['createdAt']).dt.date
    daily_activity = df.groupby('date').size().reset_index(name='count')
    daily_activity['date'] = daily_activity['date'].astype(str)
    
    # Group by topic
    topic_activity = df.groupby('topic_name').size().reset_index(name='count')
    
    return {
        'total_messages': len(df),
        'active_topics': df['topicId'].nunique(),
        'activity_by_day': daily_activity.to_dict('records'),
        'activity_by_topic': topic_activity.to_dict('records')
    }

if __name__ == "__main__":
    # Command line arguments
    if len(sys.argv) < 2:
        print("Usage: python chat_analytics.py [command] [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "chat_activity":
        days = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        result = get_chat_activity(days)
        print(json.dumps(result))
    
    elif command == "user_activity":
        user_id = sys.argv[2] if len(sys.argv) > 2 else None
        days = int(sys.argv[3]) if len(sys.argv) > 3 else 30
        result = get_user_activity(user_id, days)
        print(json.dumps(result))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1) 