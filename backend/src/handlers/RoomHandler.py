import os, uuid
import logging, boto3

from src.common.utils import Response
from botocore.exceptions import ClientError

# Create an Lambda client
lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger("handler_logger")
logger.setLevel(logging.DEBUG)

def create_room_api(event, context):
    try: 
        newRoomId = str(uuid.uuid4())[:8]
        table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
        response = table.put_item(
            Item={
                "id" : newRoomId,
                "admin" : ["default"],
                "name" : "Default Room Name",
                "messages" : []
            }, 
            ConditionExpression='attribute_not_exists(foo)'
        )
        
        return Response(response["ResponseMetadata"]["HTTPStatusCode"], {"roomid" : newRoomId})
    except Exception as e:
        logger.info("Exception {}".format(e))
        return Response(500, e.response)
        
def get_room_messages_api(event, context):
    roomId = event["pathParameters"]["roomid"]
    logger.info("Event {}".format(event))
    try: 
        messages = get_room_messages(roomId)
        return Response(200, messages)
    except Exception as e:
        logger.info("Exception {}".format(e))
        return Response(500, e.response)

def get_room_messages(roomId):
    table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : roomId }, 
        AttributesToGet  = ["messages"]
    )
    return response["Item"]["messages"]

def connect_to_room(connectionId, roomId):
    try:        
        table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "ADD connections :value",
            ExpressionAttributeValues={
                ':value': set([connectionId])
            }
        )
        return True
    except Exception as e:
        logger.info("Exception {}".format(e))
        return False

def disconnect_from_room(connectionId, roomId):
    try:        
        table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "DELETE connections :value",
            ConditionExpression='id = :id',
            ExpressionAttributeValues={
                ':id' : roomId,
                ':value': set([connectionId])
            }
        )
        return True
    except Exception as e:
        logger.info("Exception {}".format(e))
        return False

def get_room_connections(roomId):
    try: 
        table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : roomId }, 
            AttributesToGet  = ["connections"]
        )
        return response["Item"]["connections"]
    except Exception as e:
        return None

def send_message_to_room(roomId, message):
    table = dynamodb.Table(os.environ['ROOM_TABLE_NAME'])
    table.update_item(
        Key = {
            "id" :  roomId
        }, 
        UpdateExpression = "SET messages = list_append(messages, :new_question)",
        ExpressionAttributeValues={
            ':new_question': [{
                "message" : message,
            }],
        }
    )