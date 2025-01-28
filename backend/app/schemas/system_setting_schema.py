# app/schemas/system_setting_schema.py
from typing import Optional, Union
from pydantic import BaseModel, Field, ConfigDict


class SystemSettingBase(BaseModel):
    """
    Base schema for system settings
    """

    key: str = Field(..., min_length=1, max_length=100, example="maintenance_mode")
    value: Union[str, bool, int, float] = Field(..., example="false")


class SystemSettingCreate(SystemSettingBase):
    """
    Schema for creating a new system setting
    """

    pass


class SystemSettingUpdate(BaseModel):
    """
    Schema for updating an existing system setting
    """

    value: Optional[Union[str, bool, int, float]] = Field(None, example="true")

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class SystemSettingResponse(SystemSettingBase):
    """
    Schema for returning system setting information
    """

    id: int

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class SystemSettingFilter(BaseModel):
    """
    Schema for filtering system settings
    """

    key: Optional[str] = None
    value: Optional[Union[str, bool, int, float]] = None
