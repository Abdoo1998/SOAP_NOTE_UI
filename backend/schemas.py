from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    job: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    job: str

    class Config:
        orm_mode = True
        

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
