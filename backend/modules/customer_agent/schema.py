from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class CustomerAgentRequest(BaseModel):
    message: str
    history: list[Message] = []

class CustomerAgentResponse(BaseModel):
    reply: str
    history: list[Message]