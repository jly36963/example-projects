import json


def custom_serializer(obj):
    """
    Serializer that can handle datetime
    """
    return json.dumps(obj, default=str)


# from json import JSONEncoder
# from datetime import datetime

# class CustomSerializer(JSONEncoder):
#     """
#     Custom serializer that supports additional types:
#     - datetime
#     """

#     def default(self, v):
#         if isinstance(v, datetime):
#             return str(v)
#         return JSONEncoder.default(self, v)
