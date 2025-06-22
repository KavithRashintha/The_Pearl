from pydantic import BaseModel, EmailStr, ConfigDict


class AdminBase(BaseModel):
    pass


class AdminCreate(AdminBase):
    pass


class Admin(AdminBase):
    id: int
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class AdminRegistration(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "tourist"
