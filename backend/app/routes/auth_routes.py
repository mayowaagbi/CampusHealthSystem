from fastapi import APIRouter, Depends, HTTPException
from app.controllers.auth_controller import AuthController
from app.schemas.auth_schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    TokenRefreshSchema,
)
from app.schemas.token_schema import TokenSchema  # Import the TokenSchema
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(user_data: UserRegisterSchema):
    """Register a new user"""
    try:
        return await AuthController.register_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenSchema)  # Specify the response model
async def login(login_data: UserLoginSchema):
    """User  login"""
    try:
        token_data = await AuthController.login_user(login_data)
        return token_data  # Ensure this returns a dictionary matching TokenSchema
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout(current_user=Depends(get_current_user)):
    """User  logout"""
    try:
        return await AuthController.logout_user(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/refresh", response_model=TokenSchema)  # Specify the response model
async def refresh_token(token_data: TokenRefreshSchema):
    """Refresh access token"""
    try:
        token_data = await AuthController.refresh_token(token_data.refresh_token)
        return token_data  # Ensure this returns a dictionary matching TokenSchema
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
