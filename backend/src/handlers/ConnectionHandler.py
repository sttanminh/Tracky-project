import os, json, logging, boto3
from src.common.utils import Response
from src.handlers.RoomHandler import connect_to_room, disconnect_from_room, send_message_to_room, get_room_connections

dynamodb = boto3.resource('dynamodb')
logger = logging.getLogger("handler_logger")
logger.setLevel(logging.DEBUG)

# Notifications that server can send 
CONNECTION_CONFIRMED = "CONNECTION_CONFIRMED"
CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED"
NEW_BROADCAST_MESSAGE = "NEW_BROADCAST_MESSAGE"

# Socket action that server recieve 
BROADCAST_MESSAGE = "BROADCAST_MESSAGE"
ECHO_MESSAGE = "ECHO_MESSAGE"

def connection_manager_api(event, context):
    """
    Handles connecting and disconnecting for the Websocket.
    """
    connectionId = event["requestContext"].get("connectionId")
    
    if event["requestContext"]["eventType"] == "CONNECT":
        logger.info("Connect requested")        

        return Response(200, "Connect successful.")
        
    elif event["requestContext"]["eventType"] == "DISCONNECT":
        logger.info("Disconnect requested")

        roomId = get_connected_room(connectionId)
        remove_connection(connectionId)
        disconnect_from_room(connectionId, roomId)

        return Response(200, "Disconnect successful.")
    else:
        logger.error("Connection manager received unrecognized eventType.")
        return Response(500, "Unrecognized eventType.")

def connect_to_room_hanlder(event, context):
    body = event.get("body", "")  
    data = json.loads(body)
    connectionId = event["requestContext"].get("connectionId")
    
    conenction_added_to_room = connect_to_room(connectionId, data["roomId"])
    conenction_saved = save_connection(connectionId, data["roomId"])   

    _send_to_connection(connectionId, {
        "action" : CONNECTION_CONFIRMED,
        "data" : { 
            "conenction_added_to_room" : conenction_added_to_room,
            "conenction_saved" : conenction_saved,
        }
    }, event)

    return Response(200, "Message echo-ed.")
    

def broadcast_message_hanlder(event, context):
    body = json.loads(event.get("body", ""))
    roomId = body["roomId"]
    message = body["message"]

    send_message_to_room(roomId, message)
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : NEW_BROADCAST_MESSAGE,
        "data" : {
            "roomId" : roomId,
            "message" : {
                "message" : message,
            }
        }
    }, event)

    return Response(200, "Message echo-ed.")
    

def get_connected_room(connectionId):
    try:        
        table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : connectionId }, 
            AttributesToGet  = ["RoomID"]
        )
        return response["Item"]["RoomID"]
    except Exception as e:
        logger.info("Exception {}".format(e))
        return None

def remove_connection(connectionId):
    table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
    table.delete_item(Key={ "id" : connectionId })

def save_connection(connectionId, roomId):
    try:        
        # Add connectionId to the database
        table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
        table.put_item(Item={
            "id" : connectionId,            
            "RoomID" : roomId
        })
        return True
    except Exception as e:
        logger.info("Exception {}".format(e))
        return False

def echo_api(event, context):
    """
    When a message is sent on the socket, forward it to all connections.
    """
    logger.info("Message sent on WebSocket.")
    connectionId = event["requestContext"].get("connectionId")
    message = event.get("body", "")  
    
    _send_to_connection(connectionId, message, event)

    return Response(200, "Message echo-ed.")

def _send_to_connection(connection_id, data, event):
    gatewayapi = boto3.client("apigatewaymanagementapi", 
        endpoint_url = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"])
    
    return gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(data).encode('utf-8'))

def _send_to_connections(connections, data, event):
    for connection in connections: 
        _send_to_connection(connection, data, event)
