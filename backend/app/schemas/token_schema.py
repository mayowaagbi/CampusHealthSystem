from pydantic import BaseModel, Field


class TokenSchema(BaseModel):
    access_token: str = Field(..., example="your_access_token_here")
    token_type: str = Field(default="bearer", example="bearer")
    refresh_token: str = Field(
        None, example="your_refresh_token_here"
    )  # Optional field

    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            }
        }
